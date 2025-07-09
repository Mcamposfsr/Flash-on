class Validacao{
    constructor(formulario){
        this.formulario = formulario
        this.nome = formulario.nome;
        this.email = formulario.email;
        this.senha1 = formulario.senha;
        this.senha2 = formulario.senha2;
        this.data = formulario.data;
        this.descricao = formulario.descricao
        this.arquivo = formulario.dado
        
    }
    verificarFormulario(){
        let validacoes = [
        verificarValidity(this.nome),
        verificarValidity(this.email),
        verificarSenhas(this.senha1,this.senha2),
        verificarData(this.data),
        verificarValidity(this.senha1),
        verificarValidity(this.descricao),
        verificarArquivo(this.arquivo)
        ]

        return validacoes
    }
}
// VERIFICAÇÃO DOS DEMAIS INPUTS
function verificarValidity(elemento){
    if(elemento){

    let validacao = {
        valid:true,
        campo:elemento.name
    }
    // mensagens de erro
    let mensagens = {
        email:{
            typeMismatch:"Formato de e-mail incorreto.",
            valueMissing:"O campo não pode ser vazio.",
        },
        senha:{
            tooShort:"Senha muito curta",
            valueMissing:"O campo não pode ser vazio."
        },
        nome:{
            valueMissing:"O campo não pode ser vazio"
        },
        descricao:{
            valueMissing:"O campo não pode ser vazio"
        }
    }
    // erros que serão tratados
    let erros = ["typeMismatch","valueMissing","tooShort"]

    // verificacao e retorno dos erros
    erros.forEach((erro)=>{
        if(elemento.validity[erro]){
            validacao = {
                valid:false,
                campo:elemento.name,
                erro:mensagens[elemento.name][erro]
            }
        } 
    })

    return validacao
}else{
    return
}

}
// VERIFICAÇÃO DA DATA
function verificarData(elemento){
    if(elemento){

    let validacao = {
        valid:true,
        campo:elemento.name
    }
    
    let [ano, mes, dia] = elemento.value.split("-")
    let dataNascimento = new Date(ano,mes-1,dia)
    let dataAtual = new Date()
    let idade = dataAtual.getFullYear() - dataNascimento.getFullYear()
    // definir o rangeOverflow com a data atual
    elemento.max = dataAtual.toISOString().split("T")[0]

    // mensagens de erro
    let mensagens = {
        valueMissing:"Campo não pode ficar em branco.",
        customError:"Disponível apenas para maiores de 18 anos.",
        rangeUnderflow:"Data inválida.",
        rangeOverflow:"Data inválida."

    }
    // erros que serão tratados
    let erros = ["valueMissing","customError","rangeUnderflow","rangeOverflow"]

    // logica a mais
    if(idade< 18){
        elemento.setCustomValidity("Menor de idade")

    }else if(idade === 18){
        if(dataNascimento.getMonth() > dataAtual.getMonth() || (dataNascimento.getMonth() >= dataAtual.getMonth() && dataNascimento.getDate() > dataAtual.getDate())){
            elemento.setCustomValidity("Menor de idade.")
    }
    }else{
        elemento.setCustomValidity("")
    }
    // diferenciar as datas que precisam de validação de idade
    if(elemento.id == "data-foto"){
        elemento.setCustomValidity("")

    }
    // verificacao e retorno dos erros
    erros.forEach((erro)=>{
        if(elemento.validity[erro]){
            validacao = {
                valid:false,
                campo:elemento.name,
                erro:mensagens[erro]
            }
        }
    })
    
    return validacao

    }else{
        return
    }

}
// VERIFICAR SE AS SENHAS SÃO IGUAIS.
function verificarSenhas(elemento1,elemento2){
    if(elemento1 && elemento2){
    let validacao = {
        valid:true,
        campo:elemento2.name
    }
// mensagens de erro
    let mensagens = {
        valueMissing:"O campo não pode ser vazio.",
        customError:"As senhas devem ser iguais.",
        rangeUnderflow:"Data inválida.",

    }
    // erros que serão tratados
    let erros = ["valueMissing","customError"]

    // logica a mais
    if(elemento1.value !== elemento2.value){
        elemento2.setCustomValidity("Senhas diferentes")
    }else{
        elemento2.setCustomValidity("")
    }

    // verificacao e retorno dos erros
    erros.forEach((erro)=>{
        if(elemento2.validity[erro]){
            validacao =  {
                valid:false,
                campo:elemento2.name,
                erro:mensagens[erro]
            }
        }
    })


    return validacao
}else{
    return 
}
}
// VERIFICAR ARQUIVO
function verificarArquivo(elemento){
    if(elemento){
    let validacao = {
        valid:true,
        campo:elemento.name,
        erro:"",
        dado:""
    }
    if(elemento.files.length != 0){
        validacao.dado = elemento.files[0]
    }else{
        validacao.erro = "Nenhum arquivo selecionado"
        validacao.valid = false
    }
    return validacao
}

}

   
export default Validacao