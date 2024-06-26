import { Command } from 'commander'

export const program = new Command()

 program
    .option('--mode <mode>', 'Modo de trabajo de mi server', 'Production')
    .parse()