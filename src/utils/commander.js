import { Command } from 'commander';

const program = new Command();

program
    .option('--mode <mode>', 'Modo de ejecución', 'development')
    .parse(process.argv);

export { program };