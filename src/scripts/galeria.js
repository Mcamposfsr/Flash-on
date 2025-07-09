/// **MODULOS**
import Control from "/components/galeriaControl.js"
import Validacao from "/components/validarForm.js"
import ui from  "/components/ui.js"
import api from "/components/api.js"

// MENU HEADER
const btnMenu = document.querySelector(".cabecalho__div-btn")
const painelHeader = document.querySelector(".cabecalho__div-menu")
const btnLogout = document.querySelector(".cabecalho__div-menu-item--sair")

// GALERIA
const galeria = document.querySelector(".principal-galeria__secao-fotos")
const inputBusca = document.querySelector(".principal-galeria__secao-input")
const btnCardCreate = document.querySelector(".principal-galeria__secao-btn")


// MODAL
const modal = document.querySelector(".modal")
const botoesFechar = document.querySelectorAll(".btn-close")

// MODAL -- FOTO
const modalFoto = document.querySelector(".modal__foto")
const painelFoto = document.querySelector(".modal__foto-painel")
const painelFotoActionButtons = document.querySelectorAll("[data-btn]")
const btnDownloadFoto = document.querySelector(".modal__foto-enquadramento-btn")

// MODAL - CREATE

const modalForm = document.querySelector(".modal__create-form")
const modalCreate = document.querySelector(".modal__create")
const btnDescartar = document.querySelector(".modal__create-form-reset")
const inputFile = document.querySelector(".modal__create-form-input--file")
const imgForm = document.querySelector(".modal__create-form-img")
const btnUpload = document.querySelector(".modal__create-form-btn")




// VERIFICAR SECAO E RECEBER OS CARDS
async function  acessarCardsSecao(){
    return await api.acessarCards(JSON.parse(localStorage.getItem("secao")).id)
}
// RENDERIZAR CADS AO CARREGAR A PÁGINA
window.addEventListener("load",async()=>{
    let dados = await acessarCardsSecao()
    ui.renderizarCards(dados,galeria)
    

})


// ANIMAÇÃO MENU DROPDOWN
btnMenu.addEventListener("mouseover",()=>{
    btnMenu.classList.add("cabecalho__div-btn--active")
    painelHeader.classList.add("cabecalho__div-menu--open")
    painelHeader.classList.remove("cabecalho__div-menu--close")
    
})
painelHeader.addEventListener("mouseleave",()=>{
    btnMenu.classList.remove("cabecalho__div-btn--active")
    painelHeader.classList.remove("cabecalho__div-menu--open")
    painelHeader.classList.add("cabecalho__div-menu--close")
})
btnLogout.addEventListener("click",()=>{
    localStorage.setItem("secao",JSON.stringify({logado:false,user:"unknow",id:""}))
    window.location.href = "./index.html"
})

// OCULTAR MODAL
window.addEventListener("click",(e)=>{
    if(e.target === modal){
        ui.alterarDisplay(modal,modalCreate,modalFoto)
        ui.limparFormulario(modalForm)
    }
})
botoesFechar.forEach((e)=>{
    e.addEventListener("click",()=>{
        ui.alterarDisplay(modal,modalCreate,modalFoto)
        ui.limparFormulario(modalForm)
    })
})
window.addEventListener("keydown",(e)=>{
    if(!modal.classList.contains("hidden")){
        if(e.key === "Escape"){
            ui.alterarDisplay(modal,modalCreate,modalFoto)
            ui.limparFormulario(modalForm)
            document.body.style.overflow = ""
        }
    }
})

// ABRIR MODAL PAINEL FOTOS
galeria.addEventListener("click",(e)=>{
    let card = e.target.closest("[data-cardfoto]")
    let cards = document.querySelectorAll("[data-cardfoto]")
    if(card){

        if(card.dataset.cardfoto){
            modal.classList.remove("hidden")
            modalFoto.classList.remove("hidden")
            ui.renderizarPainel(card,painelFoto)     
        }
    }
    
    
}) 
// ANIMAÇÃO PAINEL FOTOS
painelFotoActionButtons.forEach((elemento)=>{
    elemento.addEventListener("click",(btn)=>{
        ui.animacaoCards(galeria,btn.target,modalFoto)

    })
})
// LÓGICA DA BUSCA DINÂMICA
inputBusca.addEventListener("input",async(e)=>{
    let cardsFiltrados = await api.filtrarCard(e.target.value)
    ui.renderizarCards(cardsFiltrados,galeria)
})
// ABRIR MODAL DE CRIAÇÃO
btnCardCreate.addEventListener("click",()=>{
    modal.classList.remove("hidden")
    modalCreate.classList.remove("hidden")
})
// LIMPAR CAMPOS MODAL CRIAÇÃO
btnDescartar.addEventListener("click",()=>{
    
    ui.limparFormulario(modalForm)

})
// ACIONAR INPUT DE ARQUIVOS
btnUpload.addEventListener("click",()=>{
    inputFile.click()
}) 
// EVENTO PARA ESCUTAR INPUT DADO
inputFile.addEventListener("change",async ()=>{
    imgForm.src = await Control.lerDados(inputFile.files[0]) 
})
// ESCUTAR EVENTO DE DELETAR O CARD
window.addEventListener("excluirCard",async (e)=>{
    await api.excluirCard(e.detail)
    let dados = await acessarCardsSecao()
    ui.renderizarCards(dados,galeria)
})
// SUBMIT FORMULÁRIO
modalForm.addEventListener("submit",async (e)=>{
    e.preventDefault()
    let novaValidacao = new Validacao(modalForm)
    let validacoes = novaValidacao.verificarFormulario()
    let resultado = validacoes.every((v)=>{
        if(v === undefined){
            return true
        }
        return v.valid
    })
    ui.limparErros()
    if(!resultado){
        ui.renderizarMensagens(modalForm,validacoes)
    }else{
        let card = {
            dados : await Control.criarInfoCard(modalForm),
            secao : JSON.parse(localStorage.getItem("secao")).id
        }


        try{
            if(modalForm.identificador.value){
                await api.editarCard(card,modalForm.identificador.value)
            }else{
                await api.salvarCard(card)
            }
        }catch(e){
            alert(e)
            return 
        }
        

        ui.limparFormulario(modalForm)
        ui.alterarDisplay(modal,modalCreate,modalFoto)

        let dados = await api.acessarCards(JSON.parse(localStorage.getItem("secao")).id)
        console.log(dados)
        ui.renderizarCards(dados,galeria)

        // ui.renderizarCards(card,galeria)
        

    }

})


