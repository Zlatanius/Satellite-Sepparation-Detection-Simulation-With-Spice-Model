# Satellite Stack SPICE Simulator

A Next.js web application for simulating and visualizing satellite stack separation using SPICE circuit simulation. Features an interactive 3D visualization, real-time voltage graphs, and configurable stack parameters.

## Prerequisites

Before you begin, you'll need to install the following software:

### 1. Node.js and npm

**macOS:**
```bash
# Install Homebrew (if not already installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js (includes npm)
brew install node
```

**Windows:**
1. Download the Node.js installer from [nodejs.org](https://nodejs.org/)
2. Run the installer and follow the prompts
3. Restart your terminal/command prompt

**Linux (Ubuntu/Debian):**
```bash
# Update package list
sudo apt update

# Install Node.js and npm
sudo apt install nodejs npm
```

**Verify installation:**
```bash
node --version  # Should show v18.x or higher
npm --version   # Should show 9.x or higher
```

### 2. ngspice (Circuit Simulator)

**macOS:**
```bash
brew install ngspice
```

**Windows:**
1. Download ngspice from [ngspice.sourceforge.net](http://ngspice.sourceforge.net/download.html)
2. Extract the archive and add the `bin` folder to your system PATH
3. Restart your terminal

**Linux (Ubuntu/Debian):**
```bash
sudo apt install ngspice
```

**Verify installation:**
```bash
ngspice --version  # Should show ngspice version information
```

## Installation

1. **Clone the repository:**
   ```bash
   # Using HTTPS
   git clone https://github.com/YOUR_USERNAME/satellites-spice.git

   # Or using SSH
   git clone git@github.com:YOUR_USERNAME/satellites-spice.git

   # Navigate to the project directory
   cd satellites-spice
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

   This will install all required packages including:
   - Next.js (React framework)
   - Recharts (charting library)
   - Framer Motion (animations)
   - Tailwind CSS (styling)
   - And other dependencies

## Running the Application

### Development Mode

Start the development server:
```bash
npm run dev
```

The application will be available at:
- **http://localhost:3000**

## Using the Application

### 1. Configure Stack Parameters

On the main page, you can configure:

**Geometry:**
- **Size (N × N):** Grid size from 1×1 to 12×12 satellites per layer
- **Stack height:** Number of layers (1-20)

**Release Timing:**
- **Release period:** Time between satellite releases in milliseconds (1-5000ms)

**Electrical:**
- **Supply voltage:** Power supply voltage (0.1-28V)
- **Reference resistance:** Resistor value in kilohms (0.1-10000 kΩ)

### 2. Run Simulation

Click the **"Simulate Stack"** button to:
1. Generate the SPICE netlist based on your configuration
2. Run the ngspice simulation
3. Parse the results
4. Navigate to the results page

### 3. View Results

The results page displays:

**Stack Visualization:**
- Interactive 3D isometric view of the satellite stack
- Color-coded columns for easy identification
- Click any column to view its voltage measurements

**Satellite Overview:**
- Table showing all satellites with their:
  - ID, position (row, column, layer)
  - Release time
  - Status indicators

**Voltage Graphs:**
- Interactive time-series voltage measurements
- Hover to see exact values
- Select different columns from the dropdown
- Smooth line charts powered by Recharts

## How It Works

### Simulation Process

1. **Netlist Generation:**
   - User configures stack parameters (size, layers, timing, voltage, resistance)
   - System generates a SPICE netlist representing the electrical model
   - Each satellite has 4 brackets with resistors and switches
   - Control signals are generated for timed release sequences

2. **SPICE Simulation:**
   - Netlist is written to `/app/simulation/netlist/test.cir`
   - ngspice runs in batch mode: `ngspice -b /app/simulation/netlist/test.cir`
   - Transient analysis simulates voltage changes over time
   - Results are saved to `app/simulation/mes_voltages.dat`

3. **Data Processing:**
   - Parser reads the space-separated voltage data
   - Format: alternating time and voltage pairs
   - Groups 4 measurements per satellite column
   - Averages measurements and converts time to milliseconds

4. **Visualization:**
   - Results are stored in sessionStorage
   - 3D isometric view shows the physical stack layout
   - Interactive graphs display voltage measurements over time
   - Recharts library handles smooth rendering of 1000+ data points

## Troubleshooting

### ngspice not found
**Error:** `ngspice: command not found`

**Solution:**
- Make sure ngspice is installed (see Prerequisites)
- Verify it's in your PATH: `which ngspice`
- On Windows, ensure the ngspice `bin` folder is in your system PATH

### Port already in use
**Error:** `Port 3000 is already in use`

**Solution:**
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or run on a different port
PORT=3001 npm run dev
```

## Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Composable charting library
- **Framer Motion** - Animation library
- **ngspice** - Circuit simulation engine
