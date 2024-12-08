import { z, ZodObject } from 'npm:zod';

export function filterFactory<
    D extends z.infer<S>,
    // deno-lint-ignore no-explicit-any
    S extends ZodObject<any>
>(callback: () => Promise<D[]>, schema: S) {
    type keys = keyof D;

    return async function (filter: Partial<D>) {
        const data = await callback();

        const keys = Object.keys(filter);
        const valid = keys.every((k) => schema.keyof().safeParse(k).success);

        const typedKeys = keys as keys[];

        if (!valid) {
            return false;
        }

        const el = data.filter((e) => {
            return typedKeys.every((v) => e[v] === filter[v]);
        });

        if (!el) return false;

        return el;
    };
}