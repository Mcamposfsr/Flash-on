// **MODULOS**
import Validacao from "/components/validarForm.js"
import ui from  "/components/ui.js"
import api from "/components/api.js"


// **ELEMENTOS HTML**

// BTN ROLAGEM DE PÁGINA
const btnExibir = document.querySelector(".principal__banner-painel-button")
// PRIMEIRA SECAO CONTEÚDO
const secao1 = document.querySelector(".principal__descricao1")
// BTN MENU HEADER
const btnCadastro = document.querySelector(".cabecalho__menu-button--criar")
const btnLogin = document.querySelector(".cabecalho__menu-button--entrar")
// MODAL
const modal = document.querySelector(".modal")
const btnInscrever = document.querySelector(".modal__content-painel-form-p--span")
// RODAPE
const secaoCreate = document.querySelector(".rodape")
// FORMULÁRIO CRIAÇÃO DE CONTA
const formCreate = document.querySelector(".rodape__card-form")
// FORMULARIO LOGIN
const formLogin = document.querySelector(".modal__content-painel-form")
// BOTOES EXPLORAR
const botoesExplorar = document.querySelectorAll("[data-btn]")

// VERIFICAR SE JÁ HÁ SECAO ATIVA
window.addEventListener("load",()=>{
    let secao = JSON.parse(localStorage.getItem("secao"))
    if(!secao){
        localStorage.setItem("secao",JSON.stringify({logado:false,user:"unknow",id:""}))
    }else if(secao.logado){
        window.location.href = "/pages/galeria.html"

    }
})

// ATIVAR MOVIMENTAÇÃO DO BTN DO BANNER
setInterval(()=>{
    btnExibir.classList.toggle("principal__banner-painel-button--fim")
    btnExibir.classList.toggle("principal__banner-painel-button--inicio")
},1000)
// BOTAO PARA MOVER PÁGINA PARA PRÓXIMA SECAO
btnExibir.addEventListener("click",()=>{
    secao1.scrollIntoView({ behavior: "smooth" });
})

// EXIBIR OU OCULTAR ELEMENTOS
function alterarDisplay(...lista){
    if(lista){
        lista.forEach((e)=>{
            e.classList.toggle("hidden")
        })
    }
}

// ABRIR MENU LOGIN
btnLogin.addEventListener("click",()=>{
    alterarDisplay(modal)
    document.body.style.overflow = "hidden"
})
botoesExplorar.forEach((e)=>{
    e.addEventListener("click",()=>{
        document.body.style.overflow = "hidden"
        alterarDisplay(modal)
    })
})

// ABRIR MENU CADASTRO
btnCadastro.addEventListener("click",()=>{
    secaoCreate.scrollIntoView({ behavior: "smooth" });
})
btnInscrever.addEventListener("click",()=>{
    modal.classList.toggle("hidden")
    document.body.style.overflow = ""
    secaoCreate.scrollIntoView({ behavior: "smooth" });
})

// EVENTOS PARA FECHAR MODAL
window.addEventListener("click",(e)=>{
    if(e.target === modal){
        alterarDisplay(modal)
        document.body.style.overflow = ""
    }
})
window.addEventListener("keydown",(e)=>{
    if(e.key === "Escape"){
        alterarDisplay(modal)
        document.body.style.overflow = ""
    }
})


// VALIDAÇÃO DE FORMULÁRIO
formCreate.addEventListener("submit",(e)=>{
    e.preventDefault()
    let novaValidacao = new Validacao(formCreate)
    let validacoes = novaValidacao.verificarFormulario()
    let resultado = validacoes.every((v)=>{
        if(v === undefined){
            return true
        }
            return v.valid
        
    })   
    console.log(resultado)
    ui.limparErros()
    if(!resultado){
        ui.renderizarMensagens(formCreate,validacoes)
        
    }else{
        api.cadastro(formCreate)
        formCreate.reset()
        setTimeout(() => {
            alert("Cadastro feito! Realize login para acessar a galeria");
        }, 100); 
    }

})

formLogin.addEventListener("submit",async (e)=>{
    e.preventDefault()
    let novaValidacao = new Validacao(formLogin)
    let validacoes = novaValidacao.verificarFormulario()
    console.log(validacoes)
    let resultado = validacoes.every((v)=>{
        if(v === undefined){
            return true
        }
        return v.valid
    })  
    console.log(resultado)
    ui.limparErros()
    if(!resultado){
        ui.renderizarMensagens(formLogin,validacoes)
    }else{
        let retornoApi = await api.login(formLogin)
        console.log(retornoApi)
        if(retornoApi.erro){
            alert(retornoApi.message)
        }else{
            let secao = JSON.parse(localStorage.getItem("secao"))
            secao.logado = true
            secao.user = retornoApi.nome
            secao.id = retornoApi.id
            localStorage.setItem("secao",JSON.stringify(secao))
            window.location.href = "/pages/galeria.html"

        }
   
    }

})