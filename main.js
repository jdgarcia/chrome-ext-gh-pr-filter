const TOOL_ID = 'filter-tool';
const EXTS = ['js', 'html', 'css', 'styl', 'cs'];


var filter = (list, fn) => Array.prototype.filter.call(list, fn);
var getFiles = () => document.querySelectorAll('.file-info a');
var filesWhere = cond => filter(getFiles(), cond);

var isExt = (file, ext) => file.title.endsWith(ext);
var isExtFn = ext => file => isExt(file, ext);
var isNotExtFn = ext => file => !isExt(file, ext);

var remove = item => item.closest('.file').querySelector('.blob-wrapper').hidden = true;
var removeAll = list => list.forEach(remove);
var removeFilesWhere = cond => removeAll(filesWhere(cond));

var add = item => item.closest('.file').querySelector('.blob-wrapper').hidden = false;
var addAll = list => list.forEach(add);
var addFilesWhere = cond => addAll(filesWhere(cond));

var solo = ext => removeFilesWhere(isNotExtFn(ext));
var hide = ext => removeFilesWhere(isExtFn(ext));
var show = ext => addFilesWhere(isExtFn(ext));


const toggleExtGen = ext => event => event.target.checked ? show(ext) : hide(ext);


function setup() {
  if (!/^\/\w+\/\w+/.test(location.pathname)) {
    return;
  }

  const container = document.getElementById('js-repo-pjax-container');

  if (!container) {
    setTimeout(setup, 100);
    return;
  }

  createToolIfNecessary();

  const observer = new MutationObserver(createToolIfNecessary);
  const config = {
    childList: true,
    subtree: true
  };

  observer.observe(container, config);
}

function createToolIfNecessary() {
  const filesDiv = document.getElementById('files');

  if (filesDiv && !document.getElementById(TOOL_ID)) {
    const tool = document.createElement('div');
    tool.id = TOOL_ID;

    tool.style.position = 'fixed';
    tool.style.top = '360px';
    tool.style.left = '9px';
    tool.style.padding = '4px 6px';

    // tool.style.backgroundColor = '#1d1d1d';
    // tool.style.border = '1px solid #484848';
    tool.style.border = '1px solid #dddddd';
    tool.style.borderRadius = '3px';

    const backToTop = document.createElement('a');
    backToTop.textContent = 'Back to Top';
    backToTop.href = 'javascript:void(0)';
    backToTop.addEventListener('click', () => {
      document.body.scrollTop = 0;
    });

    tool.appendChild(backToTop);

    const bar = document.createElement('div');
    const toggleId = 'toggle-ws';
    const toggle = document.createElement('input');
    toggle.id = toggleId;
    toggle.type = 'checkbox';
    toggle.checked = window.location.search !== '?w=';

    toggle.addEventListener('change', e => {
      window.location.search = e.target.checked ? '' : '?w=';
    });

    const label = document.createElement('label');
    label.setAttribute('for', toggleId);
    label.textContent = ' \\s';
    label.style.webkitUserSelect = 'none';

    bar.appendChild(toggle);
    bar.appendChild(label);

    tool.appendChild(bar);

    // EXTS.forEach(ext => addFilterBar(tool, ext));
    const extCounts = {};
    const increment = function (ext) {
      if (extCounts[ext] !== undefined) {
        extCounts[ext]++;
      } else {
        extCounts[ext] = 0;
      }
    };

    getFiles().forEach(file => {
      const filePath = file.title;
      const nameIndex = file.title.lastIndexOf('/');
      const fileName = nameIndex === -1 ? filePath : filePath.substring(nameIndex + 1);
      const dotIndex = fileName.lastIndexOf('.');
      if (dotIndex === -1) {
        increment('NO EXT');
      } else if (dotIndex === 0) {
        increment('DOTFILE');
      } else {
        increment(fileName.substring(dotIndex + 1));
      }
    });

    Object.keys(extCounts).forEach(ext => addFilterBar(tool, ext));

    filesDiv.appendChild(tool);
  }
}

function addFilterBar(tool, ext) {
  const bar = document.createElement('div');


  const toggleId = 'toggle-' + ext;

  const toggle = document.createElement('input');
  toggle.id = toggleId;
  toggle.type = 'checkbox';
  toggle.checked = true;

  toggle.addEventListener('change', toggleExtGen(ext));

  const label = document.createElement('label');
  label.setAttribute('for', toggleId);
  label.textContent = ' ' + ext.toUpperCase();
  label.style.webkitUserSelect = 'none';


  bar.appendChild(toggle);
  bar.appendChild(label);

  tool.appendChild(bar);
}

setup();
