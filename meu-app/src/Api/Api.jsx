fetch("https://servicodados.ibge.gov.br/api/v3/noticias/?qtd=100")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Falha na solicitação à API do IBGE");
    }
    return response.json();
  })
  .then((data) => {
    // Aqui você pode processar os dados da API, por exemplo, exibindo os títulos e datas de publicação
    const noticias = data.itens;
    noticias.forEach((noticia) => {
      const titulo = noticia.titulo;
      const dataPublicacao = noticia.data_publicacao;
      console.log(`Título: ${titulo}`);
      console.log(`Data de Publicação: ${dataPublicacao}`);
      console.log("\n");
    });
  })
  .catch((error) => {
    console.error(error);
  });
