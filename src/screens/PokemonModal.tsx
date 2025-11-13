import React from 'react';
import { Modal } from 'antd';
import { useGetPokemonDetails } from 'src/hooks/useGetPokemons';
import { tss } from '../tss';

interface PokemonModalProps {
  pokemonId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PokemonModal: React.FC<PokemonModalProps> = ({ pokemonId, isOpen, onClose }) => {
  const { classes } = useStyles();
  const { data, loading, error } = useGetPokemonDetails(pokemonId);

  return (
    <Modal open={isOpen} onCancel={onClose} footer={null} width={600} className={classes.modal}>
      {loading && <div>Loading...</div>}
      {error && <div>Error loading Pokémon details</div>}
      {data && (
        <div className={classes.content}>
          <h2>{data.name}</h2>
          <img src={data.sprite} alt={data.name} className={classes.image} />
          <div className={classes.details}>
            <p>
              <strong>ID:</strong> {data.id}
            </p>
            <p>
              <strong>Height:</strong> {data.height}
            </p>
            <p>
              <strong>Weight:</strong> {data.weight}
            </p>
            <p>
              <strong>Capture Rate:</strong> {data.captureRate}
            </p>
            <div>
              <strong>Types:</strong> {data.types?.join(', ')}
            </div>
            <div>
              <strong>Stats:</strong>
              <ul>
                {data.stats?.map((stat: any) => (
                  <li key={stat.name}>
                    {stat.name}: {stat.baseStat}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

const useStyles = tss.create(({ theme }) => ({
  modal: {},
  content: {
    color: theme.color.surface,
  },
  image: {
    maxWidth: '200px',
    display: 'block',
    margin: '0 auto',
  },
  details: {
    marginTop: '16px',
  },
}));
