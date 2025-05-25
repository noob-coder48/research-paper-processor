import React, { useEffect, useState } from 'react';
import { fetchPapers, exportToExcel, deletePaper } from '../services/api';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, InputAdornment
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import { useHistory } from 'react-router-dom';
import { saveAs } from 'file-saver';
import { styled } from '@mui/material/styles';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: theme.palette.grey[100],
}));

const Dashboard = () => {
  const [papers, setPapers] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const history = useHistory();

  useEffect(() => {
    const getPapers = async () => {
      try {
        const papersData = await fetchPapers();
        const sorted = Array.isArray(papersData)
          ? papersData.sort((a, b) => (b.id > a.id ? 1 : -1))
          : [];
        setPapers(sorted);
      } catch (err) {
        setPapers([]);
      }
    };
    getPapers();
  }, []);

  const handleExport = async () => {
    try {
      const response = await exportToExcel();
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'extracted_papers.xlsx');
    } catch (error) {
      alert('Error exporting data');
    }
  };

  const handleView = (paper) => {
    setSelectedPaper(paper);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPaper(null);
  };

  const handleDelete = async (paperId) => {
    if (!window.confirm('Are you sure you want to delete this paper?')) return;
    try {
      await deletePaper(paperId);
      setPapers((prev) => prev.filter((p) => p.id !== paperId));
    } catch (err) {
      alert('Failed to delete paper.');
    }
  };

  const handleLogout = () => {
    // Remove token and any user info from localStorage
    localStorage.removeItem('token');
    // Optionally clear other user-related storage here
    history.push('/login');
  };

  // Filter papers by title or author
  const filteredPapers = papers.filter(
    (paper) =>
      paper.title.toLowerCase().includes(filter.toLowerCase()) ||
      (Array.isArray(paper.authors)
        ? paper.authors.join(', ').toLowerCase().includes(filter.toLowerCase())
        : (paper.authors || '').toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <Box sx={{ p: 4 }}>
      {/* Top bar with logout button at the top right */}
      <Box display="flex" justifyContent="flex-end" alignItems="center" mb={2}>
        <Button
          variant="outlined"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>
      {/* Title and action buttons */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" gutterBottom>
          Uploaded Research Papers
        </Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <Button
            variant="outlined"
            color="success"
            startIcon={<DownloadIcon />}
            onClick={handleExport}
            sx={{ mr: 2 }}
          >
            Download Excel
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => history.push('/upload')}
            sx={{ mr: 2 }}
          >
            Upload New Research Paper
          </Button>
        </Box>
      </Box>
      {/* Filter input on the left top of the table */}
      <Box mb={2} display="flex" justifyContent="flex-start">
        <TextField
          variant="outlined"
          size="small"
          placeholder="Filter by title or author"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ width: 300 }}
        />
      </Box>
      {filteredPapers.length === 0 ? (
        <Typography>No papers uploaded yet.</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 2, borderRadius: 2, boxShadow: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Title</StyledTableCell>
                <StyledTableCell>Authors</StyledTableCell>
                <StyledTableCell>Date Uploaded</StyledTableCell>
                <StyledTableCell align="center">Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPapers.map((paper) => (
                <TableRow key={paper.id} hover>
                  <TableCell sx={{ maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {paper.title}
                  </TableCell>
                  <TableCell sx={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {Array.isArray(paper.authors) ? paper.authors.join(', ') : paper.authors}
                  </TableCell>
                  <TableCell>
                    {paper.date
                      ? new Date(paper.date).toLocaleString()
                      : paper.id
                        ? new Date(parseInt(paper.id.substring(0, 8), 16) * 1000).toLocaleString()
                        : 'N/A'}
                  </TableCell>
                  <TableCell align="center">
                    <Box display="flex" justifyContent="center" gap={1}>
                      <IconButton color="primary" onClick={() => handleView(paper)}>
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(paper.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Paper Detail Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ px: 3, py: 2 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" fontWeight="bold">Paper Details</Typography>
            <IconButton onClick={handleClose} size="small">
              <span style={{ fontSize: 22, fontWeight: 'bold' }}>&times;</span>
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers sx={{ px: 3, py: 2 }}>
          {selectedPaper && (
            <Box>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {selectedPaper.title}
              </Typography>
              <Box display="flex" flexWrap="wrap" alignItems="center" gap={2} mb={2}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Authors:</strong> {Array.isArray(selectedPaper.authors) ? selectedPaper.authors.join(', ') : selectedPaper.authors}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Date:</strong> {selectedPaper.date
                    ? new Date(selectedPaper.date).toLocaleString()
                    : selectedPaper.id
                      ? new Date(parseInt(selectedPaper.id.substring(0, 8), 16) * 1000).toLocaleString()
                      : 'N/A'}
                </Typography>
                {selectedPaper.doi && (
                  <Typography variant="body2" color="text.secondary">
                    <strong>DOI:</strong> {selectedPaper.doi}
                  </Typography>
                )}
              </Box>
              {selectedPaper.summary && (
                <>
                  <Box my={2}><hr style={{ border: 0, borderTop: '1px solid #eee' }} /></Box>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    Summary
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedPaper.summary}
                  </Typography>
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, justifyContent: 'flex-end' }}>
          <Button
            onClick={() => {
              handleDelete(selectedPaper?.id);
              handleClose();
            }}
            color="error"
            variant="outlined"
            sx={{ mr: 1 }}
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
          <Button onClick={handleClose} color="primary" variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;