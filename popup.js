document.addEventListener('DOMContentLoaded', function() {
  var settingsDiv = document.getElementById('settings');
  var addButton = document.getElementById('add');
  var applyButton = document.getElementById('apply');

  // Create a selector-background pair input
  function createPair(selector = '', background = '') {
    var pairDiv = document.createElement('div');
    pairDiv.className = 'pair';
    pairDiv.innerHTML = `
      <input type="text" class="selector" value="${selector}" placeholder="CSS Selector">
      <input type="text" class="background" value="${background}" placeholder="e.g., #ff0000 or linear-gradient(to right, red, yellow)">
      <input type="color" class="color-picker">
      <button class="remove">Remove</button>
    `;
    var backgroundInput = pairDiv.querySelector('.background');
    var colorPicker = pairDiv.querySelector('.color-picker');
    colorPicker.addEventListener('change', function() {
      backgroundInput.value = colorPicker.value; // Update text input with picked color
    });
    pairDiv.querySelector('.remove').addEventListener('click', function() {
      pairDiv.remove(); // Remove this pair
    });
    return pairDiv;
  }

  // Add a new pair when "Add" is clicked
  addButton.addEventListener('click', function() {
    settingsDiv.appendChild(createPair());
  });

  // Save and apply settings when "Apply" is clicked
  applyButton.addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      var url = new URL(tabs[0].url);
      var hostname = url.hostname;
      var pairs = [];
      var pairDivs = settingsDiv.querySelectorAll('.pair');
      pairDivs.forEach(function(pairDiv) {
        var selector = pairDiv.querySelector('.selector').value.trim();
        var background = pairDiv.querySelector('.background').value.trim();
        if (selector && background) {
          pairs.push({selector: selector, background: background});
        }
      });
      var settings = {};
      settings[hostname] = pairs;
      chrome.storage.local.set(settings, function() {
        console.log('Settings saved for ' + hostname);
      });
    });
  });

  // Load saved settings for the current tab
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var url = new URL(tabs[0].url);
    var hostname = url.hostname;
    chrome.storage.local.get(hostname, function(result) {
      var pairs = result[hostname] || [];
      if (pairs.length === 0) {
        settingsDiv.appendChild(createPair());
      } else {
        pairs.forEach(function(pair) {
          settingsDiv.appendChild(createPair(pair.selector, pair.background || ''));
        });
      }
    });
  });
});
