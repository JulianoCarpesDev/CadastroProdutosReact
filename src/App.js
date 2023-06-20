
import { useEffect, useState } from 'react';
import './App.css';
import Formulario from './Formulario';
import Tabela from './Tabela';

function App() {

  //Objeto produto
  const produto={
    id:0,
    nome:'',
    marca:''
  }

  // UseState
  const[btnCadastrar, setBtnCadastrar]= useState(true);
  const[produtos,setProdutos] = useState([]);
  const[objProduto, setObjProduto]= useState(produto);

  //useEffect
  useEffect(()=>{
    fetch("http://localhost:8080/listar").then(retorno => retorno.json())
    .then(retorno_convertido => setProdutos(retorno_convertido));

  },[]);

  //obtendo dados do formulario

  const aoDigitar = (e)=>{
    //console.log(e.target);
    setObjProduto({...objProduto,[e.target.name]:e.target.value});
  }

  // cadastrar produtos 
  const cadastrar = ()=>{
    fetch("http://localhost:8080/cadastrar",{
      method:'post',
      body:JSON.stringify(objProduto),
      headers:{
        'Content-type':'application/json',
        'Accept':'application/json'
      }
    }).then(retorno => retorno.json()).then(retorno_convertido=>{
      if(retorno_convertido.msg !== undefined){
        alert(retorno_convertido.msg)
      }else{
        setObjProduto([...produtos,retorno_convertido]);
        alert("Produto cadastrado com sucesso !!!")
        
        limpaFormulario();
        window.location.reload();
      }
    })
  }
// remover produtos
  const remover = ()=>{
    fetch("http://localhost:8080/remover/" + objProduto.id,{
      method:'delete',
      headers:{
        'Content-type':'application/json',
        'Accept':'application/json'
      }
    }).then(retorno => retorno.json())
    .then(retorno_convertido=>{
     alert(retorno_convertido.msg);

     // copia do vetor
     let vetorTemp = [...produtos];
     
     //indice

     let indice = vetorTemp.findIndex((p)=>{
      return p.id === objProduto.id;
     });
     // remover produto do vetor temp
     vetorTemp.splice(indice,1);

     //atualizar vetor de produtos

     setProdutos(vetorTemp);

     limpaFormulario();

    })
  }
// alterar produtos
  const alterar = ()=>{
    fetch("http://localhost:8080/alterar",{
      method:'put',
      body:JSON.stringify(objProduto),
      headers:{
        'Content-type':'application/json',
        'Accept':'application/json'
      }
    }).then(retorno => retorno.json())
    .then(retorno_convertido=>{
      if(retorno_convertido.msg !== undefined){
        alert(retorno_convertido.msg)
      }else{
        setObjProduto([...produtos,retorno_convertido]);
        alert("Produto alterado com sucesso !!!")
        
        limpaFormulario();
        window.location.reload();
      }

    })
  }
  // limpar formulario

  const limpaFormulario = ()=>{
    setObjProduto(produto)
    setBtnCadastrar(true);
  }

  // selecionar produto

  const selecionarProdutos = (indice) =>{
    setObjProduto(produtos[indice]);
    setBtnCadastrar(false);
  }
  return (
    <div>
      <Formulario botao = {btnCadastrar} eventoTeclado ={aoDigitar} cadastrar={cadastrar} obj = {objProduto}  cancelar={limpaFormulario} remover={remover} alterar ={alterar}/>
      <Tabela vetor ={produtos} selecionar={selecionarProdutos}/>
    </div>
  );
}

export default App;
