const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const tasksDir = path.join(__dirname, 'tasks');

console.log(chalk.blue('🔄 Запуск всех файлов из папки tasks...'));
console.time(chalk.yellow('⏱ Общее время выполнения'));

fs.readdirSync(tasksDir)
    .filter((file) => file.endsWith('.js'))
    .forEach((file) => {
        const taskPath = path.join(tasksDir, file);
        const label = `\n⏱ ${file}`;

        console.log(chalk.gray('\n' + '='.repeat(60)));
        console.log(chalk.green(`🚀 Выполняется: ${file}`));
        console.log(chalk.gray('-'.repeat(60)));

        console.time(chalk.magenta(label));
        try {
            require(taskPath);
        } catch (err) {
            console.error(
                chalk.red(`❌ Ошибка при выполнении ${file}: ${err.message}`)
            );
        }
        console.timeEnd(chalk.magenta(label));

        console.log(chalk.gray('='.repeat(60) + '\n'));
    });

console.log(chalk.blue('✅ Все задачи завершены.'));
