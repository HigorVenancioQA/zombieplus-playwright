const { test, expect } = require('../support');

const data = require('../support/fixtures/tvshows.json')

const { executeSQL } = require('../support/database');

test.beforeAll(async () => {
    await executeSQL(`DELETE from tvshows`)
})

test('Deve poder cadastrar uma nova série', async ({ page }) => {
    const tvshows = data.create

    // é importante estar logado
    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.tvshows.create(tvshows)
    await page.popup.haveText(`A série '${tvshows.title}' foi adicionada ao catálogo.`)
})

test('Deve poder remover uma série', async ({ page, request }) => {

    const tvshows = data.to_remove
    await request.api.postSerie(tvshows)

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.tvshows.goTvshow()
    await page.tvshows.remove(tvshows.title)
    await page.popup.haveText('Série removida com sucesso.')

})

test('Não deve poder cadastrar quando o titulo já existe', async ({ page, request }) => {
    const tvshows = data.duplicate
    await request.api.postSerie(tvshows)

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.tvshows.create(tvshows)
    await page.popup.haveText(`O título '${tvshows.title}' já consta em nosso catálogo. Por favor, verifique se há necessidade de atualizações ou correções para este item.`)
})

test('Não deve cadastrar quando os campos obrigatorios não são preenchidos', async ({ page }) => {
    // await page.login.visit()
    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    // await page.login.isLoggedIn('admin')
    await page.tvshows.goTvshow()
    await page.tvshows.goForm()
    await page.tvshows.submit()

    await page.tvshows.alertHaveText([
        'Campo obrigatório',
        'Campo obrigatório',
        'Campo obrigatório',
        'Campo obrigatório',
        'Campo obrigatório (apenas números)'
    ])
})

test('Deve realizar busca pelo termo zombie', async ({ page, request }) => {

    const tvshows = data.search
    tvshows.data.forEach(async (m) => {
        await request.api.postSerie(m)
    })

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.tvshows.goTvshow()
    await page.tvshows.search(tvshows.input)
    await page.tvshows.tableHave(tvshows.outputs)
})