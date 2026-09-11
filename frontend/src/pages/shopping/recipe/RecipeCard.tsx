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
  steps: {
    description: string;
    duration: string | null;
  }[];
};

type RecipeCardProps = {
  recipe: Recipe;
};

const RecipeCard = ({ recipe }: RecipeCardProps) => {
  return (
    <div
      className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 mt-4 text-left"
    >
      <h3 className="font-bold text-lg text-gray-900 dark:text-white">
        {recipe.name}
      </h3>

      {recipe.missing_ingredients.length > 0 && (
        <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <p className="text-sm font-bold text-yellow-800 dark:text-yellow-400">
            不足している材料
          </p>

          <ul className="text-sm text-yellow-700 dark:text-yellow-300 list-disc list-inside">
            {recipe.missing_ingredients.map((missing, index) => (
              <li key={index}>{missing}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-2">
        <p className="font-bold text-sm text-gray-700 dark:text-gray-300">
          材料
        </p>

        <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc list-inside">
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
      </div>

      <div className="flex gap-4 mt-2 text-xs text-orange-600 font-bold">
        <span>
          難易度: {recipe.metadata.difficulty}
        </span>

        <span>
          全体時間: {recipe.metadata.total_time}
        </span>
      </div>

      {recipe.steps.length > 0 && (
        <div className="mt-3 text-sm text-left">
          <p className="font-bold border-b border-gray-300 dark:border-gray-600 ml-6 pb-1 mb-2 text-gray-900 dark:text-white">
            作り方
          </p>

          <ol className="list-decimal list-outside space-y-2 text-gray-800 dark:text-gray-200 mt-2 pl-2">
            {recipe.steps.map((step, index) => (
              <li key={index} className="pl-1">
                <span>{step.description}</span>

                {step.duration && (
                  <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded ml-1 text-gray-700 dark:text-gray-300">
                    ({step.duration})
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
      )}

      {recipe.steps.length > 0 && (
        <div className="mt-3 text-sm text-left">
          <p className="font-bold border-b border-gray-300 dark:border-gray-600 ml-6 pb-1 mb-2 text-gray-900 dark:text-white">
            作り方
          </p>

          <ol className="list-decimal list-outside space-y-2 text-gray-800 dark:text-gray-200 mt-2 pl-2">
            {recipe.steps.map((step, index) => (
              <li key={index} className="pl-1">
                <span>{step.description}</span>

                {step.duration && (
                  <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded ml-1 text-gray-700 dark:text-gray-300">
                    ({step.duration})
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
      )}

      {recipe.share_url && (
        <button
          type="button"
          onClick={() => {
            const data = recipe.share_url.split('/').pop();

            if (data) {
              window.open(`/recipes/share/${data}`, '_blank');
            }
          }}
          className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-bold"
        >
          レシピ共有
        </button>
      )}
    </div>
  );
};

export default RecipeCard;
