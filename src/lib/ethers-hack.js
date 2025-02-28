/**
 * This is a module resolution hack to fix the 'parseUnits is not exported from ethers' error
 * when using unlock-js. This fixes ethers exports at the module level.
 */

// Save the original require function
const originalRequire = module.constructor.prototype.require;

// Override the require function to intercept ethers imports
module.constructor.prototype.require = function(modulePath) {
  // Call the original require function to get the module
  const originalModule = originalRequire.apply(this, arguments);
  
  // Check if we're requiring 'ethers'
  if (modulePath === 'ethers') {
    // Add parseUnits directly to the ethers object
    if (originalModule && originalModule.utils && originalModule.utils.parseUnits) {
      originalModule.parseUnits = originalModule.utils.parseUnits;
      originalModule.formatUnits = originalModule.utils.formatUnits;
      originalModule.getAddress = originalModule.utils.getAddress;
    }
  }
  
  // Return the potentially modified module
  return originalModule;
};
