import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';

const MyAppBar = () => (
  <AppBar position="static" color="primary" elevation={2}>
    <Toolbar>
      <ArticleIcon sx={{ mr: 2 }} />
      <Typography variant="h6" component="div">
        Research Paper Processor
      </Typography>
    </Toolbar>
  </AppBar>
);

export default MyAppBar;