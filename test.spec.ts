import {expect, test} from '@playwright/test';

function now() {
    return new Date().toISOString();
}

function step(step?: string) {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function actualStep(target: Function, context: ClassMethodDecoratorContext) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return function replacementMethod(...args: any) {
            const name = step ?? this.constructor.name + ' > ' + (context.name as string);
            return test.step(name, async () => {
                return await target.call(this, ...args);
            });
        };
    };
}

function elem(page) {
    return page.locator('.elementthatdoesntexist');
}

test('test', async ({ page }) => {
    await page.goto('https://playwright.dev');

    await test.step('la la', async () => {
        try {
            console.log(`waitFor start: ${now()}`)
            await elem(page).waitFor({ timeout: 4000 });
        } catch (e) {
            console.log(`entered catch: ${now()}`);
        }
        console.log(`past try-catch: ${now()}`);
        await expect(elem(page)).toHaveCount(0);
        console.log(`past expect: ${now()}`);
    });
});
