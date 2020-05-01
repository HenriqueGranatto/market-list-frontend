$(document).ready(async function(){
    selectAnalytic()
})

async function selectAnalytic()
{
    const response = await (await send(`http://localhost:3333/analytic`)).json()

    $("#totalItems").text(`${response.totalItems}`)
    $("#totalBetterPrice").text(`R$ ${parseFloat(response.totalBetterPrice).toFixed(2)}`)
    $("#totalBetterMarkets").text(`${response.totalBetterMarkets}`)
    $("#totalMarkets").text(`${response.totalMarkets}`)

    populateOtherMarketsCards(response.markets)
}



/** HELPER DOS SELECTs */

/** Popula o select com as categorias */
async function populateOtherMarketsCards(markets)
{
    let cards = ""

    $("#marketsData").html("")

    if(!!markets || markets.lenght < 1)
    {
        $("#marketsData").html("<h4 class='h4 mb-0 text-gray-800'>Nada para mostrar</h4>")
        return
    }

    markets.map(function(market){
        cards += 
        `<div class="col-xl-3 col-md-6 mb-4">
            <div class="card border-left-danger shadow h-100 py-2">
            <div class="card-body">
                <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                    <div class="text-xs font-weight-bold text-info text-uppercase mb-1">${market.name}</div>
                    <div class="row no-gutters align-items-center">
                        <div class="col-auto">
                            <div class="h6 mb-0 mr-3 font-weight-bold text-danger">Total: R$ ${parseFloat(market.totalPrice).toFixed(2)}</div>
                            <div class="h6 mb-0 mr-3 font-weight-bold text-success">Economia: R$ ${parseFloat(market.economy).toFixed(2)}</div>
                        </div>
                    </div>
                </div>
                <div class="col-auto">
                    <i class="fas fa-shopping-cart fa-2x text-gray-300"></i>
                </div>
                </div>
            </div>
            </div>
        </div>`    
    })

    $("#marketsData").html(cards)
}



/** HELPERS HTTP */

/**
 * Prepara o objeto settings do FETCH
 * @param body = dados a serem enviados na requisição
 */
function prepareRequest(method, body = false)
{
    let settings = 
    { 
        method: method,
        mode: 'cors',
        cache: 'no-cache',
        headers: { "content-Type": "application/json" }
    }

    if(body)
    {
        settings.body = body
    }

    return settings
}

/**
 * Enviar uma requisição para o back end
 * @param {*} url    = URL da requisição
 * @param {*} method = verbo HTTP ser utilizado
 * @param {*} body   = corpo da requisição
 */
function send(url, method = "GET", body = false)
{
    return fetch(url, prepareRequest(method, body))
}