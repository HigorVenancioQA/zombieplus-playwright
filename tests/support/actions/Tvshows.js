const { expect } = require('@playwright/test')

export class Tvshows {
    constructor(page) {
        this.page = page
    }

    async goTvshow() {
        await this.page.locator('a[href$=tvshows]').click()
    }

    async goForm() {
        await this.page.locator('a[href$="register"]').click()
    }

    async submit() {
        await this.page.getByRole('button', { name: 'Cadastrar' }).click()
    }

    async create(tvshows) {

        await this.goTvshow()
        await this.goForm()
        await this.page.getByLabel('Titulo da série').fill(tvshows.title)
        await this.page.getByLabel('Sinopse').fill(tvshows.overview)
        await this.page.locator('#select_company_id .react-select__indicator').click()
        await this.page.locator('.react-select__option').filter({ hasText: tvshows.company }).click()
        await this.page.locator('#select_year .react-select__indicator').click()
        await this.page.locator('.react-select__option').filter({ hasText: tvshows.release_year }).click()
        await this.page.getByLabel('Temporadas').fill(tvshows.seasons)
        await this.page.locator('input[name=cover]').setInputFiles('tests/support/fixtures' + tvshows.cover)
        if (tvshows.featured) {
            await this.page.locator('.featured .react-switch').click()
        }

        await this.submit()
        await this.page.waitForTimeout(3000)
    }

    async search(target) {

        await this.page.getByPlaceholder("Busque pelo nome").fill(target)

        await this.page.click('.actions button')
    }

    async tableHave(content) {
        const rows = this.page.getByRole('row')
        await expect(rows).toContainText(content)
    }


    async alertHaveText(target) {
        await expect(this.page.locator('.alert')).toHaveText(target)
    }

    async remove(title) {
        await this.page.getByRole('row', { name: title }).getByRole('button').click()
        await this.page.click('.confirm-removal')
    }
}