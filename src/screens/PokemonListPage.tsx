import React from 'react';
import { tss } from '../tss';
import { useGetPokemons } from 'src/hooks/useGetPokemons';
import { PokemonModal } from './PokemonModal';
import { useNavigate, useParams } from 'react-router-dom';

export const PokemonListPage = () => {
  const { classes } = useStyles();
  const { data, loading, error } = useGetPokemons();
  const [searchTerm, setSearchTerm] = React.useState('');

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const handlePokemonClick = (pokemonId: string) => {
    navigate(`/list/pokemon/${pokemonId}`);
  };

  const handleCloseModal = () => {
    navigate('/list');
  };

  const filteredData = React.useMemo(() => {
    if (!searchTerm) return data;
    return data?.filter(
      (pokemon) =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pokemon.types?.some((type) => type.toLowerCase().includes(searchTerm.toLowerCase())),
    );
  }, [data, searchTerm]);

  return (
    <div className={classes.root}>
      {error && <div>Error: {error.message}</div>}

      <input
        type="text"
        placeholder="Search by name or type..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={classes.searchInput}
      />

      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {filteredData && filteredData.length > 0 ? (
            filteredData.map((d) => (
              <li key={d.id}>
                <button
                  type="button"
                  className={classes.listItem}
                  onClick={() => handlePokemonClick(d.id)}
                >
                  {d.sprite && <img src={d.sprite} alt={d.name} className={classes.sprite} />}
                  <div className={classes.info}>
                    <div className={classes.name}>{d.name}</div>
                    {d.types && d.types.length > 0 && (
                      <div className={classes.types}>
                        {d.types.map((type) => (
                          <span key={type} className={classes.type}>
                            {type}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </button>
              </li>
            ))
          ) : (
            <div>No Pokémon found.</div>
          )}
        </ul>
      )}

      <PokemonModal pokemonId={id || null} isOpen={!!id} onClose={handleCloseModal} />
    </div>
  );
};

const useStyles = tss.create(({ theme }) => ({
  root: {
    color: theme.color.text.primary,
    '& ul': {
      listStyleType: 'none',
      padding: 0,
    },
  },
  listItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '16px',
    padding: '8px',
    borderRadius: '8px',
    transition: 'background-color 0.2s ease',
    width: '100%',
    textAlign: 'left',
    border: 'none',
    background: 'none',
    font: 'inherit',
    color: 'inherit',
    '&:hover': {
      backgroundColor: theme.color.hover,
      cursor: 'pointer',
    },
  },
  sprite: {
    width: 80,
    height: 80,
  },
  info: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    paddingTop: '16px',
  },
  name: {
    fontSize: '18px',
    fontWeight: 'bold',
  },
  searchInput: {
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '16px',
    marginBottom: '16px',
    padding: '8px',
    width: '100%',
  },
  types: {
    display: 'flex',
    gap: '8px',
  },
  type: {
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '14px',
  },
}));
