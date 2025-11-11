# London Housing Market Explorer

This website provides a comprehensive interactive platform for exploring and analyzing housing market data across London's 33 boroughs. The platform addresses the challenge of making complex housing market data accessible and actionable for prospective homebuyers, renters, and property investors. By integrating historical housing price data (1995-2024), demographic statistics, and quality of life indicators, the website enables users to make informed decisions about where to live in London based on multiple criteria including affordability, lifestyle preferences, and area characteristics.

## Use this README File

The **London Housing Market Explorer** is an interactive data visualization and analysis platform built with modern web technologies. The site features:

- **Interactive Borough Comparison**: Side-by-side comparison of up to 4 boroughs with dynamic charts showing historical house price trends, rental growth, and key statistics
- **Personalized Neighborhood Finder**: A unique suitability scoring system with 12 customizable preference sliders that calculates and visualizes the best-matching boroughs on an interactive D3.js map
- **Comprehensive Area Guides**: Detailed profiles for each of London's 33 boroughs including history, lifestyle, transport links, and local amenities
- **Top Performers Dashboard**: Ranking of boroughs by various metrics including price growth, rental yields, and quality of life indicators

**Frameworks and Technologies Used:**
- Frontend: Vanilla JavaScript, [D3.js v7](https://d3js.org/) for data visualization, [TopoJSON](https://github.com/topojson/topojson) for geographic boundaries
- Backend: [Node.js](https://nodejs.org/) with [Express 5.1.0](https://expressjs.com/)
- API Documentation: [Swagger/OpenAPI 3.0](https://swagger.io/) with interactive UI
- Data Processing: [csv-parser 3.2.0](https://www.npmjs.com/package/csv-parser) for efficient CSV parsing
- Design: CSS3 with custom scroll-driven animations and responsive grid layouts

The website implements a high-performance architecture featuring:
- In-memory triple-index caching system for millisecond-level query response times
- RESTful API with flexible multi-parameter queries
- Real-time map coloring based on user-defined preferences
- Smooth scroll-triggered transitions and fullscreen breakout views

##  Replace the Tags on the side menu of GitHub

Recommended tags: `london-housing`, `data-visualization`, `d3js`, `property-analysis`, `interactive-map`, `housing-market`, `nodejs`, `express`, `swagger-api`, `geojson`, `topojson`, `real-estate`, `london-boroughs`, `web-application`

## Include A Section That Tells Developers How To Install The App

### Prerequisites

- Node.js v16.0.0 or higher
- npm v7.0.0 or higher

### Installation Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/iiishop/Four-Sights.git
   cd Four-Sights
   ```

2. **Install backend dependencies**
   ```bash
   cd Website/Backend
   npm install
   ```

3. **Start the backend server**
   ```bash
   node server.js
   ```
   The server will start on `http://localhost:3000` and automatically load housing data into memory.

4. **Access the application**
   - Main website: `http://localhost:3000`
   - API documentation: `http://localhost:3000/api-docs`

### Development Mode

To run the backend with auto-reload on file changes:
```bash
npm run dev
```
(Requires `nodemon` to be installed globally: `npm install -g nodemon`)

### Key Dependencies

**Backend:**
- express: ^5.1.0
- csv-parser: ^3.2.0
- cors: ^2.8.5
- swagger-jsdoc: ^6.2.8
- swagger-ui-express: ^5.0.1

**Frontend:**
- D3.js: v7
- TopoJSON: v3
- Vanilla JavaScript (ES6+)

### License

This project is licensed under the Creative Commons CC0 1.0 Universal (CC0 1.0) Public Domain Dedication. You can copy, modify, distribute and perform the work, even for commercial purposes, all without asking permission. See the [LICENSE](LICENSE) file for full details.

##  Contact Details

**Project Team:** Four Sights Development Team

**Institution:** UCL Centre for Advanced Spatial Analysis (CASA)

**Course:** CASA0017 Web Architecture

**Repository:** [https://github.com/iiishop/Four-Sights](https://github.com/iiishop/Four-Sights)

For questions, bug reports, or feature requests, please open an issue on the GitHub repository or contact the development team through the UCL CASA department.

**Data Sources:**
- Housing Price Data: UK Office for National Statistics (ONS)
- Geographic Data: London Datastore
- Borough Statistics: Multiple UK government open data sources 
