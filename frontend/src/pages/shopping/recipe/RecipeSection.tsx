import { useEffect, useState } from 'react';
import api from '../../../utils/axios';
import RecipeCard from './RecipeCard';


type Recipe = {
  name: string;
  share_url: string;
  missing_ingredients: string[];
  ingredients: string[];
  amount: string;
  metadata: {
    difficulty: string;
    total_time: string;
  };
  steps: { //Ai応答
    description: string;
    duration: string | null;
  }[];
};

const RecipeSection = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [ingredients, setIngredients] = useState('');
  const [jobId, setJobId] = useState<string | null>(() => {
    return sessionStorage.getItem('recipe_job_id');
  });
  const [recipeError, setRecipeError] = useState<string | null>(null);

  // 保存していたレシピを復元
  useEffect(() => {
    const savedRecipes = sessionStorage.getItem('latest_recipes');
    const savedJobId = sessionStorage.getItem('recipe_job_id');

    if (savedRecipes) {
      setRecipes(JSON.parse(savedRecipes));
    }

    if (savedJobId) {
      setJobId(savedJobId);
    }
  }, []);


  const handleSuggest = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('handleSuggest called');

    // 新しく生成するときだけ前のレシピを消す
    setRecipes([]);
    sessionStorage.removeItem('latest_recipes');

    setRecipeError(null);

    try {
      const response = await api.post('/api/recipes', {
        ingredients: ingredients,
      });

      const newJobId = response.data.job_id;

      setJobId(newJobId);
      sessionStorage.setItem('recipe_job_id', newJobId);

      console.log('recipe API:', response.data);
    } catch (error: any) {
      console.error('recipe API error:', error);

      if (error.response?.status === 422) {
        setRecipeError(error.response.data.errors.ingredients[0]);
      }
    }

  };

  const checkRecipeStatus = async () => {
    if (!jobId) {
      return;
    }

    try {
      const response = await api.get(`/api/recipes/${jobId}`);

      console.log('recipe status:', response.data);
      console.log('recipes:', response.data.recipes);

      if (response.data.status === 'completed') {
        setRecipes(response.data.recipes);

        // 生成済みレシピを保存
        sessionStorage.setItem(
          'latest_recipes',
          JSON.stringify(response.data.recipes)
        );

        setJobId(null);
        sessionStorage.removeItem('recipe_job_id');
      }

      if (response.data.status === 'error') {
        setRecipeError(response.data.message);
        setJobId(null);
        sessionStorage.removeItem('recipe_job_id');
      }
    } catch (error) {
      console.error('recipe status error:', error);
    }
  };

  useEffect(() => {
    if (!jobId) {
      return;
    }

    checkRecipeStatus();

    const interval = setInterval(() => {
      checkRecipeStatus();
    }, 3000);

    return () => {
      clearInterval(interval);
    };

  }, [jobId]);

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-bold dark:text-white">
        献立提案
      </h2>

      <div className="flex items-center gap-3 p-4 bg-orange-50 dark:bg-gray-800 rounded-xl border border-orange-200 dark:border-gray-700 overflow-hidden">
        <svg
          className="w-8 h-8 text-yellow-500 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
          />
        </svg>

        <p className="text-[10px] sm:text-xs text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap overflow-hidden">
          慈江美仁麻呂が献立提案を無料枠内にて授けるぞよ
        </p>
      </div>

      <form onSubmit={handleSuggest}>
        {recipeError && (
          <p className="text-sm text-red-500">
            {recipeError}
          </p>
        )}

        <textarea
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          disabled={!!jobId}
          className="w-full h-32 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent dark:text-white text-sm p-2"
          placeholder="食材を改行して入力"
        />

        <button
          type="submit"
          disabled={!!jobId}
          className={`w-full mt-4 py-3 bg-orange-500 text-white rounded-xl font-bold transition-opacity text-sm ${jobId ? 'opacity-50 cursor-not-allowed' : ''
            }`}
        >
          {jobId
            ? '慈江美仁麻呂が只今思案中でおじゃる…'
            : '雅な献立を求める'}
        </button>
      </form>

      {recipes.map((recipe, index) => (
        <div key={index}>
          <RecipeCard recipe={recipe} />
        </div>
      ))}

    </section>
  );
};

export default RecipeSection;