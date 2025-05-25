# Research Paper Processor Frontend

This is the frontend part of the Research Paper Processor application, built using React and Material UI. The application allows users to upload research paper PDFs, extract relevant information, view and manage their papers, and export the data in Excel format.

## Features

- User authentication (signup and login)
- PDF upload for research papers
- Extraction of DOI, title, authors, and summary (via backend)
- Display of extracted information in a user-friendly dashboard
- Filter/search papers by title or author
- Export extracted data to Excel
- **Delete papers**: Users can delete papers from the dashboard (soft delete; deleted papers are hidden and not exported)

## Technologies Used

- **React**: Frontend framework
- **Material UI**: UI components
- **Axios**: HTTP requests
- **FileSaver**: Download Excel files
- **React Router**: Routing

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm (Node package manager)

### Installation

1. Clone the repository:

   ```sh
   git clone <repository-url>
   cd research-paper-processor/frontend
   ```

2. Install the dependencies:

   ```sh
   npm install
   ```

### Running the Application

To start the development server, run:

```sh
npm start
```

The application will be available at `http://localhost:3000`.

### Folder Structure

- `public/`: Contains the static files, including the main HTML file.
- `src/`: Contains the React components and services.
  - `components/`: Reusable components for login, signup, PDF upload, and Excel export.
  - `pages/`: Components representing different pages of the application.
  - `services/`: API service for making requests to the backend.

### Building for Production

To create a production build, run:

```sh
npm run build
```

The build artifacts will be stored in the `build/` directory.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.