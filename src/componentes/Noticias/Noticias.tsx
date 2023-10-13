import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Header from '../Header';
import style from './style.module.css';

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

function formatDataPublicacao(data_publicacao: string) {
    const dataParts = data_publicacao.split(' ')[0].split('/');
    const horaPart = data_publicacao.split(' ')[1] || '00:00:00';
    const dataISO8601 = `${dataParts[2]}-${dataParts[1]}-${dataParts[0]}T${horaPart}.000Z`;
    return dataISO8601;
}

function Noticias() {
    const [noticias, setNoticias] = useState<Noticia[]>([]);
    const [favoritos, setFavoritos] = useState<number[]>([]);
    const [favoritosState, setFavoritosState] = useState<boolean[]>([]);

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

        const favoritosStateCopy = [...favoritosState];
        favoritosStateCopy[noticiaId] = !isFavorito;
        setFavoritosState(favoritosStateCopy);
    };

    return (
        <>
            <Header />
            <div>
                <h1>Notícias mais recentes do IBGE</h1>
                <div className={style.noticias}>
                    {noticias.map((noticia) => (
                        <div className={style.card} key={noticia.id}>
                            <h2 className={style.cardTitulo}>{noticia.titulo}</h2>
                            <p className={style.cardIntroducao}>{noticia.introducao}</p>
                            <p className={style.cardData}>
                                Data de publicação: {noticia.data_publicacao} ({formatDistanceToNow(new Date(formatDataPublicacao(noticia.data_publicacao)), { addSuffix: true, locale: pt })})
                            </p>
                            <button
                                className={`${style.cardButton} ${favoritosState[noticia.id] ? style.favoritado : ''}`}
                                onClick={() => toggleFavorito(noticia.id)}
                            >
                                {favoritosState[noticia.id] ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                        <path d="M16.5 3C14.68 3 13.14 4.54 12 5.64 10.86 4.54 9.32 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55L12 20.55l-1.1-1.01C6.4 15.15 4 13.19 4 10.5 4 8.5 5.5 7 7.5 7c1.54 0 3.04.99 3.57 2.36h1.87C13.46 7.99 14.96 7 16.5 7c2 0 3.5 1.5 3.5 3 0 2.69-2.4 4.65-6.1 8.05z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                    </svg>
                                )}
                            </button>
                            <a href={noticia.link} target="_blank" rel="noopener noreferrer">
                                Leia mais
                            </a>
                        </div>
                    ))}
                </div>
                <h2>Notícias Favoritas</h2>
                <div className={style.noticias}>
                    {noticias
                        .filter((noticia) => favoritos.includes(noticia.id))
                        .map((noticia) => (
                            <div className={style.card} key={noticia.id}>
                                <h2 className={style.cardTitulo}>{noticia.titulo}</h2>
                                <p className={style.cardIntroducao}>{noticia.introducao}</p>
                                <p className={style.cardData}>
                                    Data de publicação: {noticia.data_publicacao} ({formatDistanceToNow(new Date(formatDataPublicacao(noticia.data_publicacao)), { addSuffix: true, locale: pt })})
                                </p>
                                <p className={style.cardData}>Data de publicação: {noticia.data_publicacao}</p>
                                <a href={noticia.link} target="_blank" rel="noopener noreferrer">
                                    Leia mais
                                </a>
                            </div>
                        ))}
                </div>
            </div>
        </>
    );
}

export default Noticias;
