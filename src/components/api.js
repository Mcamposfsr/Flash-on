import axios from "axios"
// RECOLHIMENTO DE DADOS
class Dados {
    constructor(form) {
        this.nome = form.nome ? form.nome.value || null : null; // Verifica se form.nome existe
        this.email = form.email ? form.email.value : null; // Email sempre esperado
        this.senha = form.senha ? form.senha.value : null; // Senha sempre esperado
        this.data = form.data ? new Date(form.data.value).toISOString() : null; // Verifica se form.data existe
    }
}
const api = {
    // LINK ENDPOINT API
    url:"http://localhost:5500/",
    endpointUsuarios:"usuarios",
    endpointCards:"cards",

    // SALVAR NOVO CADASTRO
    async cadastro(form){
        let dados = new Dados(form)
        try{
             let response = await axios.post(`${this.url}${this.endpointUsuarios}`,dados,{
                headers:{
                    "Content-Type":"application/json"
                }
            })
            console.log(response.data)
        }catch(e){
            alert(`Erro ao salvar o cadastro. ERRO: ${e}`)
        }
    },
    // ACESSAR CADASTRO
    async login(form){
        let dados = new Dados(form)
        try{
        let response = await axios.get(`${this.url}${this.endpointUsuarios}`,{
            params:{email:dados.email}
        })
        console.log(response.status)
        if(response.data.length == 0){
            throw new Error("Usuário não encontrado.")
        }
        else if(!(response.data[0].senha == dados.senha)){
            throw new Error("Senha incorreta")
        }
        else{
            return {nome:response.data[0].nome, id:response.data[0].id}
        }

    }catch(e){
        if(e.message.includes("Network Error")){
            return {erro:true,message:"Erro de conexão com o servidor"}
        }
        return {erro:true,message:e.message}
    }
    },
    // SALVAR DADOS DA CRIAÇÃO DE CARD
    async salvarCard(card){
        try{
            let response = await axios.post(`${this.url}${this.endpointCards}`,card,
                {
                headers:{
                    "Content-Type":"application/json"
                }
            })
        }catch(e){

            throw new Error(`Ocorreu um errro: ${e}`)
        }
    },
    // ACESSAR CARDS DO USUÁRIO
    async acessarCards(secao){
        try{
            let response = await axios.get(`${this.url}${this.endpointCards}`,{
                headers:{
                    "Content-Type":"application/json"
                },
                params:{
                    secao:secao
                }
                
            })

            return response.data
        }catch(e){

            throw new Error(`Ocorreu um errro: ${e}`)
            
        }
    },
    async filtrarCard(filtro){
        try{
            let response = await axios.get(`${this.url}${this.endpointCards}`,{
            headers:{
                "Content-Type":"application/json"
            }})
            
            let cardsFiltrados = response.data.filter((element)=>{

                if(element.dados.nome.toLowerCase().includes(filtro.toLowerCase()) || element.dados.descricao.toLowerCase().includes(filtro.toLowerCase())){
                    return element
                }
                
            })
            
            return cardsFiltrados

        }catch(e){

                throw new Error(`Ocorreu um errro: ${e}`)

            }
    },
    async editarCard(card,id){  
        console.log(id)
        try{
            let response = await axios.put(`${this.url}${this.endpointCards}/${id}`,card,{
                headers:{
                    "Content-Type":"application/json"
                }
            })

            console.log(response.data)

        }catch(e){
            throw new Error(`Ocorreu um errro: ${e}`)
        }
    },
    async excluirCard(id){
        try{
            await axios.delete(`${this.url}${this.endpointCards}/${id}`,{
                headers:{
                    "Content-Type":"application/json"
                },
            })
        }catch(e){
            throw new Error(`Ocorreu um errro: ${e}`)
        }
    }

    
}
export default api