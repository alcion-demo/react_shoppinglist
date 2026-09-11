<?php

namespace App\Services;

class RecipeShareService
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function encode(array $recipe): string
    {
        $compressed = gzcompress(json_encode(
            $recipe,
            JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR
        ));

        $encoded = strtr(base64_encode($compressed), [
            '+' => '-',
            '/' => '_',
            '=' => ''
        ]);

        return url('/recipes/share/' . $encoded);
    }

    public function decode(string $data): array
    {
        $encoded = strtr($data, [
            '-' => '+',
            '_' => '/'
        ]);

        $padding = strlen($encoded) % 4;

        if ($padding > 0) {
            $encoded .= str_repeat('=', 4 - $padding);
        }

        $compressed = base64_decode($encoded, true);

        if ($compressed === false) {
            throw new \InvalidArgumentException(
                'あな、おそろしや無効なデータでおじゃる'
            );
        }

        return json_decode(
            gzuncompress($compressed),
            true,
            512,
            JSON_THROW_ON_ERROR
        );
    }
}
