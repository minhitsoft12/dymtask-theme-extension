// Apply settings to elements
function applySettings(pairs) {
  pairs.forEach(function(pair) {
    var elements = document.querySelectorAll(pair.selector);
    elements.forEach(function(element) {
      element.style.background = pair.background; // Set background (color or gradient)
    });
  });
}

// Apply settings on page load
var hostname = window.location.hostname;
chrome.storage.local.get(hostname, function(result) {
  var pairs = result[hostname] || [];
  applySettings(pairs);
});

// Listen for storage changes and reapply settings
chrome.storage.onChanged.addListener(function(changes, areaName) {
  if (areaName === 'local' && changes[hostname]) {
    var newPairs = changes[hostname].newValue || [];
    applySettings(newPairs);
  }
});
