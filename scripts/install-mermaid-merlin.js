const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Path to the pnpm workspace file in mermaid-merlin
const pnpmWorkspacePath = path.join(__dirname, '..', 'node_modules', '@eth-peach-lab', 'mermaid-merlin', 'pnpm-workspace.yaml');

// Function to patch the pnpm-workspace file to remove cytoscape patch
function patchPnpmWorkspace() {
  try {
    if (fs.existsSync(pnpmWorkspacePath)) {
      // Create a backup of the original file
      const content = fs.readFileSync(pnpmWorkspacePath, 'utf8');
      fs.writeFileSync(`${pnpmWorkspacePath}.bak`, content);
      
      // Remove the patchedDependencies section
      const packageJsonPath = path.join(__dirname, '..', 'node_modules', '@eth-peach-lab', 'mermaid-merlin', 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        if (packageJson.pnpm && packageJson.pnpm.patchedDependencies) {
          delete packageJson.pnpm.patchedDependencies;
          fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
          console.log('Removed patchedDependencies from package.json');
        }
      }
      
      console.log('Successfully patched pnpm-workspace.yaml');
    } else {
      console.error('pnpm-workspace.yaml not found');
    }
  } catch (error) {
    console.error('Error patching pnpm-workspace.yaml:', error);
  }
}

// Main function to build mermaid-merlin
function buildMermaidMerlin() {
  try {
    const mermaidMerlinPath = path.join(__dirname, '..', 'node_modules', '@eth-peach-lab', 'mermaid-merlin');
    
    if (!fs.existsSync(mermaidMerlinPath)) {
      console.error('mermaid-merlin package not found in node_modules');
      return;
    }
    
    // Patch the pnpm-workspace.yaml file
    patchPnpmWorkspace();
    
    // Install dependencies and build
    console.log('Installing dependencies for mermaid-merlin...');
    execSync('pnpm install --no-frozen-lockfile', { 
      cwd: mermaidMerlinPath, 
      stdio: 'inherit',
      env: { ...process.env, SKIP_PATCH_CHECK: 'true' }
    });
    
    console.log('Building mermaid-merlin...');
    execSync('pnpm build', { 
      cwd: mermaidMerlinPath, 
      stdio: 'inherit',
      env: { ...process.env, SKIP_PATCH_CHECK: 'true' }
    });
    
    console.log('Successfully built mermaid-merlin');
  } catch (error) {
    console.error('Error building mermaid-merlin:', error);
    process.exit(1);
  }
}

// Run the build process
buildMermaidMerlin();