import { useState, useEffect } from 'react';

export interface Noticia {
    id: number;
    tipo: string;
    titulo: string;
    introducao: string;
    data_publicacao: string;
    produto_id: number;
    produtos: string;
    editorias: string;
    imagens: string;
    produtos_relacionados: string;
    destaque: boolean;
    link: string;
}

const fetchNoticias = async () => {
    try {
        const response = await fetch('https://servicodados.ibge.gov.br/api/v3/noticias/?qtd=100');

        if (!response.ok) {
            throw new Error('Erro ao obter notícias: ' + response.statusText);
        }

        const data: { items: Noticia[] } = await response.json();
        return data.items;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error('Erro ao obter notícias: ' + error.message);
        } else {
            throw new Error('Erro desconhecido ao obter notícias');
        }
    }
};

function Noticias() {
    const [noticias, setNoticias] = useState<Noticia[]>([]);
    const [favoritos, setFavoritos] = useState<number[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const noticiasData = await fetchNoticias();
                setNoticias(noticiasData);
            } catch (error) {
                console.error('Erro ao obter notícias:', error);
            }
        }

        fetchData();
    }, []);

    const toggleFavorito = (noticiaId: number) => {
        const isFavorito = favoritos.includes(noticiaId);
        if (isFavorito) {
            const updatedFavoritos = favoritos.filter((id) => id !== noticiaId);
            setFavoritos(updatedFavoritos);
        } else {
            setFavoritos([...favoritos, noticiaId]);
        }
    };

    return (
        <div>
            <h1>Notícias mais recentes do IBGE</h1>
            <ul>
                {noticias.map((noticia) => (
                    <li key={noticia.id}>
                        <h2>{noticia.titulo}</h2>
                        <p>{noticia.introducao}</p>
                        <p>Data de publicação: {noticia.data_publicacao}</p>
                        <button onClick={() => toggleFavorito(noticia.id)}>
                            {favoritos.includes(noticia.id) ? 'Remover dos favoritos' : 'Favoritar'}
                        </button>
                        <a href={noticia.link} target="_blank" rel="noopener noreferrer">
                            Leia mais
                        </a>
                    </li>
                ))}
            </ul>
            <h2>Notícias Favoritas</h2>
            <ul>
                {noticias
                    .filter((noticia) => favoritos.includes(noticia.id))
                    .map((noticia) => (
                        <li key={noticia.id}>
                            <h2>{noticia.titulo}</h2>
                            <p>{noticia.introducao}</p>
                            <p>Data de publicação: {noticia.data_publicacao}</p>
                            <a href={noticia.link} target="_blank" rel="noopener noreferrer">
                                Leia mais
                            </a>
                        </li>
                    ))}
            </ul>
        </div>
    );
}

export default Noticias;
