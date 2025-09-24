# Knowledge Assist Dashboard

A comprehensive IT documentation and SOP (Standard Operating Procedures) management platform built with React.js, Bootstrap, and Material-UI.

![Knowledge Assist Dashboard](https://via.placeholder.com/1200x600/667eea/ffffff?text=Knowledge+Assist+Dashboard)

## 🚀 Features

### Core Functionality
- **Category-based Organization**: Browse documentation by categories (Windows, Linux, Network, Database, Services, AWS, Azure)
- **Advanced Search**: Full-text search with voice recognition support
- **SOP Management**: Complete CRUD operations for Standard Operating Procedures
- **Interactive UI**: Hover effects, smooth animations, and responsive design
- **Modal Views**: Detailed SOP viewing with step-by-step instructions

### Technical Features
- **Voice Search**: Click the microphone icon to search using voice commands
- **Responsive Design**: Mobile-first approach with tablet and desktop optimizations
- **Modern UI**: Material-UI components with Bootstrap grid system
- **State Management**: React hooks for efficient state handling
- **Print Support**: Print-friendly SOP documentation
- **Export Functionality**: Share SOPs via native sharing API or clipboard

### User Experience
- **Intuitive Navigation**: Sidebar with category navigation
- **Visual Feedback**: Loading states, hover effects, and animations
- **Accessibility**: WCAG compliant with keyboard navigation support
- **Performance**: Optimized rendering and lazy loading

## 🛠️ Tech Stack

- **Frontend**: React 18, React Router DOM
- **UI Framework**: Material-UI v5, Bootstrap 5, React Bootstrap
- **Icons**: React Icons
- **Speech Recognition**: Web Speech API
- **Build Tool**: Create React App
- **Styling**: CSS3 with custom properties, Flexbox, Grid

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/knowledge-assist-dashboard.git
   cd knowledge-assist-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Build for Production

1. **Create production build**
   ```bash
   npm run build
   # or
   yarn build
   ```

2. **Serve the build**
   ```bash
   npm install -g serve
   serve -s build
   ```

## 🚀 Deployment Guide

### Option 1: Netlify (Recommended)

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Drag and drop the `build` folder to [Netlify Drop](https://app.netlify.com/drop)
   - Or connect your GitHub repository for automatic deployments

3. **Configure build settings**
   - Build command: `npm run build`
   - Publish directory: `build`

### Option 2: Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

### Option 3: GitHub Pages

1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add to package.json**
   ```json
   {
     "homepage": "https://yourusername.github.io/knowledge-assist-dashboard",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d build"
     }
   }
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

### Option 4: Docker

1. **Create Dockerfile**
   ```dockerfile
   FROM node:16-alpine as build
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . ./
   RUN npm run build

   FROM nginx:alpine
   COPY --from=build /app/build /usr/share/nginx/html
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **Build and run**
   ```bash
   docker build -t knowledge-assist .
   docker run -p 80:80 knowledge-assist
   ```

## 📁 Project Structure

```
knowledge-assist-dashboard/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Navbar.js          # Navigation bar with search
│   │   ├── Sidebar.js         # Category navigation sidebar
│   │   ├── Dashboard.js       # Main dashboard with categories
│   │   ├── CategoryView.js    # SOP list for categories
│   │   └── SOPModal.js        # SOP detail modal
│   ├── data/
│   │   └── dummyData.js       # Sample data for development
│   ├── App.js                 # Main application component
│   ├── App.css                # Application styles
│   ├── index.js               # React entry point
│   └── index.css              # Global styles
├── package.json
└── README.md
```

## 🎯 Usage Guide

### Navigation
- **Sidebar**: Click the hamburger menu to open/close the sidebar
- **Categories**: Click on any category card or sidebar item to view SOPs
- **Home**: Click "Dashboard" in sidebar or logo to return to main page

### Search Functionality
- **Text Search**: Type in the search bar to find SOPs by title, description, or tags
- **Voice Search**: Click the microphone icon and speak your search query
- **Real-time**: Search results update as you type

### Managing SOPs
- **View**: Click "View Details" on any SOP card to see full instructions
- **Add**: Click the floating "+" button or "Add New SOP" in empty categories
- **Edit**: Click the edit icon on SOP cards or in the detail modal
- **Delete**: Click the delete icon (confirms before deletion)

### SOP Modal Features
- **Details Tab**: View complete SOP information and steps
- **Edit Tab**: Modify SOP content, priority, and tags
- **History Tab**: See revision history and changes
- **Actions**: Print, share, bookmark, or delete SOPs

## 🎨 Customization

### Themes
Modify the CSS custom properties in `src/index.css`:

```css
:root {
  --primary-color: #667eea;    /* Main brand color */
  --secondary-color: #764ba2;  /* Secondary brand color */
  --success-color: #28a745;    /* Success indicators */
  --warning-color: #ffc107;    /* Warning indicators */
  --danger-color: #dc3545;     /* Error indicators */
}
```

### Categories
Add new categories in `src/data/dummyData.js`:

```javascript
{
  id: 8,
  name: 'Security',
  icon: 'fas fa-shield-alt',
  description: 'Security policies and procedures',
  color: '#e74c3c',
  count: 25
}
```

### Components
- Modify component styles in `src/App.css`
- Add new features in respective component files
- Extend functionality using React hooks

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
REACT_APP_TITLE=Knowledge Assist Dashboard
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_VERSION=1.0.0
```

### Speech Recognition
The voice search feature requires HTTPS in production. Ensure your deployment uses SSL/TLS.

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

## 📊 Performance

### Optimization Tips
- Use React.memo() for expensive components
- Implement virtual scrolling for large lists
- Optimize images and assets
- Enable compression on your server
- Use service workers for caching

### Bundle Analysis
```bash
npm install -g webpack-bundle-analyzer
npm run build
npx webpack-bundle-analyzer build/static/js/*.js
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/new-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m "Add new feature"
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/new-feature
   ```
5. **Open a Pull Request**

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs on [GitHub Issues](https://github.com/your-username/knowledge-assist-dashboard/issues)
- **Discussions**: Join [GitHub Discussions](https://github.com/your-username/knowledge-assist-dashboard/discussions)

## 🚧 Roadmap

### v2.0 Features
- [ ] User authentication and authorization
- [ ] Real-time collaboration
- [ ] Advanced analytics dashboard
- [ ] API integration for external data sources
- [ ] Mobile app (React Native)
- [ ] Dark/Light theme toggle
- [ ] Advanced search filters
- [ ] Workflow automation
- [ ] Integration with external tools (Slack, Teams)
- [ ] Multi-language support

## 🙏 Acknowledgments

- **Material-UI Team** for the excellent component library
- **Bootstrap Team** for the responsive grid system
- **Font Awesome** for the comprehensive icon set
- **React Team** for the amazing framework
- **Open Source Community** for inspiration and resources

---

**Built with ❤️ for IT professionals and documentation enthusiasts** 