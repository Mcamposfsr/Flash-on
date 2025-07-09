class Control{
    // LER OS DADOS DO INPUT FILE
    static async criarInfoCard(formulario){
        let dataFormatada = new Date(formulario.data.value).toLocaleDateString()
        let card ={
            data: dataFormatada,
            descricao: formulario.descricao.value,
            nome: formulario.nome.value,
            srcImg: await this.lerDados(formulario.dado.files[0])
            
        }
        return card
    }
    static async lerDados(dado){
        let src = await new Promise((resolve,reject)=>{

            let leitor = new FileReader()
            leitor.onload = () =>{
                resolve(leitor.result)
            }
            leitor.onerro = () =>{
                reject("Erro na leitura do arquivo")
            }
            leitor.readAsDataURL(dado)
        })
        return src
    }
    
}



export default Control