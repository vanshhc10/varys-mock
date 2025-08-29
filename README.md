# Varys AI Chat Application

A modern, responsive AI chat application built with React that matches the design shown in the screenshot.

## Features

- **Modern UI Design**: Clean, minimalist interface with smooth animations
- **Responsive Layout**: Adapts to different screen sizes
- **Collapsible Sidebar**: Toggle sidebar visibility for more screen space
- **Navigation Menu**: Easy access to different features (Chat, Crypt, Quick Draft, History, Settings, Profile)
- **Interactive Chat**: Message input with send functionality
- **Welcome Screen**: Beautiful welcome card for new users

## Screenshots

The application features:
- Left sidebar with dark header containing "Varys" title and collapse button
- Navigation items with icons (Chat, Crypt, Quick Draft, History, Settings, Profile)
- Main chat area with "Chat" header and "New Chat" button
- Welcome card with icon, title, and description
- Message input field with send button
- "Made in Bolt" branding

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository or navigate to the project directory
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

1. Start the development server:
   ```bash
   npm start
   ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

3. The application will automatically reload when you make changes

### Building for Production

To create a production build:

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── Sidebar.js          # Left navigation sidebar
│   ├── Sidebar.css         # Sidebar styles
│   ├── ChatArea.js         # Main chat interface
│   └── ChatArea.css        # Chat area styles
├── App.js                  # Main application component
├── App.css                 # App-level styles
├── index.js                # Application entry point
└── index.css               # Global styles
```

## Technologies Used

- **React 18**: Modern React with hooks
- **CSS3**: Custom styling with flexbox layouts
- **Lucide React**: Beautiful, customizable icons
- **Create React App**: Development environment

## Customization

The application is designed to be easily customizable:

- Colors and themes can be modified in the CSS files
- Icons can be changed using different Lucide React icons
- Layout dimensions can be adjusted in the CSS variables
- Additional features can be added to the navigation menu

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is open source and available under the MIT License.
