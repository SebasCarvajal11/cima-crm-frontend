import fs from 'fs';

const file = 'src/components/TaskManagement/TaskManagement.jsx';
let content = fs.readFileSync(file, 'utf8');

const replacements = {
  "import './TaskManagement.css';": "",
  'className="task-management-container"': 'className="p-4 md:p-8 bg-gradient-to-br from-gray-50 to-gray-200 min-h-screen"',
  'className="task-tabs"': 'className="bg-white rounded-lg mb-6 shadow-sm"',
  'className="task-header"': 'className="flex flex-col md:flex-row justify-between items-center mb-8 p-5 bg-white rounded-xl shadow-md gap-4"',
  'className="task-header-actions"': 'className="flex items-center gap-2"',
  'className="task-filters"': 'className="flex flex-wrap gap-4 p-4 bg-white rounded-lg mb-6 shadow-sm items-center"',
  'className="loading-container"': 'className="flex justify-center p-10"',
  'className="task-grid"': 'className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8 p-4"',
  'className="task-card"': 'className="bg-white rounded-xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 relative flex flex-col hover:-translate-y-1"',
  'className="task-checkbox"': 'className="absolute top-2 left-2 z-10"',
  'className="delete-icon"': 'className="absolute top-2 right-2 z-10"',
  'className="task-card-header"': 'className="flex justify-between items-start mb-4 w-full"',
  'className="task-project-name"': 'className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2"',
  'className="task-project-icon"': 'className="text-gray-500"',
  'className={`task-status-chip ${getStatusClass(task.status)}`}': 'className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(task.status)}`}',
  'className="task-actions"': 'className="flex items-center gap-2 ml-auto relative z-10"',
  'className="task-card-description"': 'className="flex-grow mb-4 text-gray-600 text-sm leading-relaxed"',
  'className="task-card-footer"': 'className="flex justify-between items-center text-xs text-gray-500 border-t border-gray-100 pt-3"',
  'className="task-worker-info"': 'className="flex items-center gap-2"',
  'className="task-date"': 'className="text-gray-400 text-sm"',
  'className="stats-container"': 'className="p-5 bg-white rounded-xl shadow-md"',
  'className="stats-card-content"': 'className="flex items-center justify-between"',
  'className="stats-card-icon total"': 'className="flex items-center justify-center w-12 h-12 rounded-xl text-blue-500 bg-blue-100 mr-4"',
  'className="stats-card-icon completed"': 'className="flex items-center justify-center w-12 h-12 rounded-xl text-green-600 bg-green-100 mr-4"',
  'className="stats-card-icon in-progress"': 'className="flex items-center justify-center w-12 h-12 rounded-xl text-blue-800 bg-blue-100 mr-4"',
  'className="stats-card-icon pending"': 'className="flex items-center justify-center w-12 h-12 rounded-xl text-orange-500 bg-orange-100 mr-4"',
  'className="stats-progress-container"': 'className="flex flex-col gap-4"',
  'className="stats-progress-item"': 'className="flex flex-col gap-2"',
  'className="stats-progress-label"': 'className="flex justify-between text-sm"',
  'className="stats-progress-bar-container"': 'className="w-full h-2 bg-gray-100 rounded-full overflow-hidden"',
  'className="stats-progress-bar completed"': 'className="h-full rounded-full transition-all duration-500 bg-green-500"',
  'className="stats-progress-bar in-progress"': 'className="h-full rounded-full transition-all duration-500 bg-blue-500"',
  'className="stats-progress-bar pending"': 'className="h-full rounded-full transition-all duration-500 bg-orange-400"',
  'className="status-dot completed"': 'className="w-3 h-3 rounded-full mr-2 bg-green-500"',
  'className="status-dot in-progress"': 'className="w-3 h-3 rounded-full mr-2 bg-blue-500"',
  'className="status-dot pending"': 'className="w-3 h-3 rounded-full mr-2 bg-orange-400"',
  'className="stats-detail-card"': 'className="p-6 rounded-xl bg-white shadow-sm h-full"',
  'className="stats-info-grid"': 'className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5"',
  'className="stats-info-item"': 'className="flex items-center p-4 bg-gray-50 rounded-lg hover:-translate-y-1 hover:shadow-md transition-all duration-200"',
  'className="stats-info-icon efficiency"': 'className="flex items-center justify-center w-12 h-12 rounded-xl mr-3 bg-green-100 text-green-600"',
  'className="stats-info-content"': 'className="flex flex-col"'
};

for (const [key, value] of Object.entries(replacements)) {
  content = content.split(key).join(value);
}

// Update the getStatusClass function to return Tailwind classes instead of CSS class names
const oldGetStatusClass = `  const getStatusClass = (status) => {
    switch(status) {
      case 'Completed':
        return 'task-status-completed';
      case 'In Progress':
        return 'task-status-progress';
      default:
        return 'task-status-pending';
    }
  };`;

const newGetStatusClass = `  const getStatusClass = (status) => {
    switch(status) {
      case 'Completed':
        return 'bg-green-50 text-green-800 border border-green-400';
      case 'In Progress':
        return 'bg-blue-50 text-blue-900 border border-blue-900';
      default:
        return 'bg-yellow-50 text-orange-500 border border-orange-300';
    }
  };`;

content = content.replace(oldGetStatusClass, newGetStatusClass);

fs.writeFileSync(file, content, 'utf8');
console.log('Replacements completed successfully!');
