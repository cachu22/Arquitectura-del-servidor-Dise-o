const program = new Command()

program
    .option('-d', 'Variable para debug', false)
    .option('-p <port>', 'Puerto del server', 8000)
    .option('--mode <mode>', 'Modo de trabajo de mi server', 'Production')
    .option('-u <user>', 'Usuario utilizando el applicativo', 'No se ha declarado')
    .option('-l, --letters [Letters...]', 'specify letter')
program.parse()

console.log('Options: ', program.opts());
console.log('Argumentos: ', program.args);

//Ejemplo
// node process.js -d -p 3000 --mode development -u root --letters a b s
// node process.js -p 3000 -u root 2 a 5 --letters a b s