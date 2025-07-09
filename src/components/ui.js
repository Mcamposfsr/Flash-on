const ui = {
    //RENDERIZAR MENSAGENS DE ERROS NOS FORMULÁRIOS
    async renderizarMensagens(form,validacoes){
        for(let validacao of validacoes){
            if(validacao){
                
                if(!validacao.valid){
                    let txtErro = form.querySelector(`[data-erro="${validacao.campo}"]`)
                    txtErro.textContent = validacao.erro  
                }}
        }
    },
    // LIMPAR MENSAGENS DE ERROS
    limparFormulario(formulario){
        formulario.reset()
        this.limparErros()
        formulario.querySelector(".modal__create-form-img").src = "/imagem-em-branco.jpeg"
        formulario.identificador.value = ""
    },
    limparErros(){
        document.querySelectorAll(`[data-erro]`).forEach((e)=>{
            e.textContent = ""
        })
    },
    // ESCONDER ELEMENTOS
    alterarDisplay(...lista){
        if(lista){
            lista.forEach((e)=>{
                if(!e.classList.contains("hidden")){
                    e.classList.toggle("hidden")
                }
            })
        }
    },
    // RENDERIZAR PAINEIS AO CLICAR NOS CARDS
    renderizarPainel(card,painel){
        painel.innerHTML = ""
        painel.setAttribute("data-ordem",card.dataset.cardfoto)
        this.criarPainelCard(card,painel)
    },
    // ANIMAR NEXT E PREVIOUS DOS CARDS
    animacaoCards(galeria,buttonEvento,modal){
        let numeroCard = Number.parseInt(modal.querySelector("[data-ordem]").dataset.ordem)
        let cards = galeria.querySelectorAll("[data-cardfoto]")
        let painel  = modal.querySelector(".modal__foto-painel")
        // painel.innerHTML = ""
        
        // ANIMAÇÃO ANTERIOR
        if(buttonEvento.dataset.btn === "anterior"){
            modal.classList.toggle("modal__foto--esquerda")
            let action = setInterval(()=>{

                if((numeroCard - 1)<0){
                    this.renderizarPainel(cards[cards.length - 1],painel)
                    
                }else{
                    this.renderizarPainel(cards[numeroCard - 1],painel)
                }

                modal.classList.toggle("modal__foto--esquerda")
                clearInterval(action)

            },300)

            // ANIMAÇÃO PRÓXIMOn
        }else if(buttonEvento.dataset.btn === "posterior"){
            modal.classList.toggle("modal__foto--direita")
            let action = setInterval(()=>{

                if((numeroCard + 1) === cards.length){  
                    this.renderizarPainel(cards[0],painel)
                    
                }else{
                    this.renderizarPainel(cards[numeroCard + 1],painel)
                }

                modal.classList.toggle("modal__foto--direita")
                clearInterval(action)
            },300)

        }
    },
    // RENDERIZAR CARDS NA TELA
    renderizarCards(dados,listaCards){
            listaCards.innerHTML = `
        `
        // LISTA DOS CARDS
        let cards = this.criarCard(dados)
        // CARD CLICÁVEL PARA ABRIR MENU DE CRIAÇÃO
        
        cards.forEach((card)=>{
            listaCards.appendChild(card)
        })
        
        

    },
    
    //FUNÇÃO AUXÍLIAR PARA CRIAR PAINEIS DOS CARDS
    criarPainelCard(card,painel){
        let cardImgSrc = card.querySelector('.principal-galeria__secao-fotos-card-img').src
        let cardDesc = card.querySelector('.principal-galeria__secao-fotos-card-descricao').textContent
        let cardData = card.querySelector('.principal-galeria__secao-fotos-card-data').textContent
        let cardNome = card.querySelector('.principal-galeria__secao-fotos-card-nome').textContent


        let div = document.createElement("div")
        div.classList.add("modal__foto-enquadramento")

        let img = document.createElement("img")
        img.src = cardImgSrc
        img.alt = "imagem fotografia" 
        img.classList.add("modal__foto-enquadramento-img")

        let button = document.createElement("button")
        button.classList.add("modal__foto-enquadramento-btn")
        // FUNÇÃO DOWNLOAD BTN
        button.addEventListener("click",()=>{

            let link = document.createElement("a")
            link.classList.add("hidden")

            link.href = cardImgSrc
            link.download = cardNome

            link.click()
            link.remove()

        })
        // CRIANDO ENQUADRAMENTO DA IMAGEM
        div.appendChild(img)
        div.appendChild(button)

        let descricao = document.createElement("p")
        descricao.classList.add("modal__foto-paragrafo")
        descricao.classList.add("modal__foto-paragrafo--descricao")
        descricao.textContent = cardDesc

        let data = document.createElement("p")
        data.classList.add("modal__foto-paragrafo")
        data.classList.add("modal__foto-paragrafo--data")
        data.textContent = cardData


        let local = document.createElement("p")
        local.classList.add("modal__foto-paragrafo")
        local.classList.add("modal__foto-paragrafo--local")
        local.textContent = cardNome


        painel.appendChild(div)
        painel.appendChild(descricao)
        painel.appendChild(data)
        painel.appendChild(local)
    
    },
    // FUNÇÃO AUXÍLIAR PARA CRIAR CARDS
    criarCard(infoCards){
        let listaCards = infoCards.map((infoCard,i)=>{

        let div = document.createElement("div")
        div.classList.add("principal-galeria__secao-fotos-card")

        // VERIFICAR SE É PRECISO RENDERIZAR UM CARD OU UMA LISTA DE CARDS
        div.setAttribute("data-cardfoto",i)
        div.setAttribute("data-id",infoCard.id)


        let img = document.createElement("img")
        img.alt = "Fotografia do cartão"
        img.src = infoCard.dados.srcImg
        img.classList.add("principal-galeria__secao-fotos-card-img")

        let btnEditar = document.createElement("button")
        btnEditar.classList.add("principal-galeria__secao-fotos-card-btn")
        btnEditar.classList.add("principal-galeria__secao-fotos-card-btn--editar")

        // ADICIONAR FUNÇÃO DE EDITAR CARD
        btnEditar.addEventListener("click",(e)=>{
            e.stopPropagation()
            this.preencherFormulario(infoCard)
            
        })

        let btnExcluir = document.createElement("button")
        btnExcluir.classList.add("principal-galeria__secao-fotos-card-btn")
        btnExcluir.classList.add("principal-galeria__secao-fotos-card-btn--excluir")

        btnExcluir.addEventListener("click",(e)=>{
            e.stopPropagation()
            
            let evento = new CustomEvent("excluirCard",{detail:infoCard.id})
            window.dispatchEvent(evento)
            
        })

        let painel = document.createElement("div")
        painel.classList.add("principal-galeria__secao-fotos-card-painel")

        painel.appendChild(btnEditar)
        painel.appendChild(btnExcluir)

        let descricao = document.createElement("p")
        descricao.classList.add("principal-galeria__secao-fotos-card-descricao")
        descricao.textContent = infoCard.dados.descricao

        let data = document.createElement("p")
        data.classList.add("principal-galeria__secao-fotos-card-data")
        data.textContent = infoCard.dados.data


        let local = document.createElement("p")
        local.classList.add("principal-galeria__secao-fotos-card-nome")
        local.textContent = infoCard.dados.nome


        div.appendChild(img)
        div.appendChild(painel)
        div.appendChild(descricao)
        div.appendChild(data)
        div.appendChild(local)

        return div
        })
        return listaCards
        
    },
    // ABRIR MODAL DE EDIÇÃO AO CLICAR NO BOTÃO DE EDITAR CARD
    preencherFormulario(infoCard){
        const modalForm = document.querySelector(".modal__create-form")
        const modalCreate = document.querySelector(".modal__create")
        const modal = document.querySelector(".modal")

        // MOSTRAR MODAL EDIT
        modal.classList.remove("hidden")
        modalCreate.classList.remove("hidden")
        console.log(infoCard.dados.data)

        let [dia,mes,ano] = infoCard.dados.data.split("/")
        let dataFormadata = `${ano}-${mes}-${dia}`


        modalForm.identificador.value = infoCard.id
        modalForm.nome.value = infoCard.dados.nome
        modalForm.data.value = dataFormadata
        modalForm.descricao.value = infoCard.dados.descricao




    }
    
    // 
}


export default ui
