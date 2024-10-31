import { getCodeStats } from '../src/utils/countLines';

async function main() {
  try {
    const stats = await getCodeStats();
    console.log('\nCode Statistics\n');
    console.log(`Total Lines: ${stats.formattedLines}`);
    console.log(`Total Files: ${stats.fileCount}`);
    console.log('\nBreakdown by Extension:');
    
    // Sort extensions by lines of code
    const sortedExtensions = Object.entries(stats.byExtension)
      .sort(([, a], [, b]) => b.lines - a.lines);

    for (const [ext, { files, lines }] of sortedExtensions) {
      const percentage = ((lines / stats.totalLines) * 100).toFixed(2);
      console.log(`${ext.padEnd(8)} ${lines.toString().padStart(8)} lines (${percentage}%) in ${files} files`);
    }
  } catch (error) {
    console.error('Error counting lines:', error);
    process.exit(1);
  }
}

main();
