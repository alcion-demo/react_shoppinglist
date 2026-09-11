import { useEffect, useState } from 'react';
import api from '../../../utils/axios';
import RecipeCard from './RecipeCard';

type Recipe = {
  name: string;
  share_url?: string;
  missing_ingredients: string[];
  ingredients: string[];
  amount: string;
  metadata: {
    difficulty: string;
    total_time: string;
  };
  steps: {
    description: string;
    duration: string | null;
  }[];
};

const RecipeSharePage = () => {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      const data = window.location.pathname.split('/').pop();

      if (!data) {
        setError('献立の復元に失敗いたしました');
        return;
      }

      try {
        const response = await api.get(`/api/recipes/share/${data}`);

        setRecipe(response.data.recipe);
      } catch (error) {
        console.error('shared recipe error:', error);
        setError('献立の復元に失敗いたしました');
      }
    };

    fetchRecipe();
  }, []);

  if (error) {
    return (
      <section className="p-6 text-center">
        <p className="text-red-500">{error}</p>
      </section>
    );
  }

  if (!recipe) {
    return (
      <section className="p-6 text-center">
        <p>読み込み中...</p>
      </section>
    );
  }

  return (
    <section className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-bold dark:text-white mb-4">
        献立共有
      </h2>

      <RecipeCard recipe={recipe} />
    </section>
  );
};

export default RecipeSharePage;
