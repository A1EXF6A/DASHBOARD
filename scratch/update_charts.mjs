import fs from 'fs';
import path from 'path';

const chartsDir = path.resolve('frontend/src/components/Charts');
const files = fs.readdirSync(chartsDir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  const filePath = path.join(chartsDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Look for the loading ternary check
  // Usually it's:
  // {loading ? (
  //   <div className="w-full h-full flex flex-col items-center justify-center">
  //     <div className="..."></div>
  //     <p className="text-sm text-slate-500">{t('loading')}</p>
  //   </div>
  // ) : (
  //   <ResponsiveContainer width="100%" height="100%">
  
  // We want to replace `) : (` when followed by `<ResponsiveContainer`
  // with `) : (data.length === 0 || Object.keys(data).length === 0) ? ( <div className="w-full h-full flex flex-col items-center justify-center text-center px-4"><p className="text-sm text-slate-500 dark:text-slate-400">{t('no_data')}</p></div> ) : (`
  
  if (!content.includes('t(\'no_data\')')) {
    const rx = /\)\s*:\s*\(\s*(<ResponsiveContainer)/g;
    content = content.replace(rx, ') : (!data || data.length === 0) ? (\n          <div className="w-full h-full flex flex-col items-center justify-center px-6 text-center">\n            <p className="text-sm text-slate-500">{t(\'no_data\')}</p>\n          </div>\n        ) : (\n          $1');
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
  }
});
