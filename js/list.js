$(document).ready(async function(){
    selectList()
})

async function selectList()
{
    const response = await send(`http://localhost:3333/list`)
    renderReportData(await response.json())
}

async function insertList()
{
    populateProductOptions()
    populateMarketOptions()

    $("#btnListModal").off()
    $('#listModal').modal('show')

    $("#listModalPrice").val("")
    $("#listModalAmount").val("")
    $("#listModalWeighing").val("")

    $("#btnListModal").click(async function(){
        let payload = getListModalData()

        const response = await send(`http://localhost:3333/list`, "POST", payload)

        if(response.status == 200)
        {
            $('#listModal').modal('hide')

            Swal.fire({
                icon: 'success',
                title: 'Item adicionado',
                showConfirmButton: false,
                timer: 1000
            })

            selectList()
        }
    })
}

async function updateList(id, market, product, weight, weighing, amount, price)
{
    await populateProductOptions()
    await populateMarketOptions()

    $("#btnListModal").off()
    $('#listModal').modal('show')

    $(`#listModalProduct`).val(product)
    $(`#listModalMarket`).val(market)
    $("#listModalPrice").val(price)
    $("#listModalWeight").val(weight)
    $("#listModalAmount").val(amount)
    $("#listModalWeighing").val(weighing)
    
    $("#btnListModal").click(async function(){
        const payload = getListModalData()
        const response = await send(`http://localhost:3333/list/${id}`, "PUT", payload)

        if(response.status == 200)
        {
            $('#listModal').modal('hide')

            Swal.fire({
                icon: 'success',
                title: 'Item atualizado',
                showConfirmButton: false,
                timer: 1000
            })

            selectList()
        }
    })
}

async function deleteList(id)
{
    Swal.fire({
        title: 'Você tem certeza?',
        text: "Não será possível desfazer essa ação!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não',
        showClass: {
            popup: 'animated fadeInDown faster'
        },
        hideClass: {
            popup: 'animated fadeOutUp faster'
        }
    })
    .then(async (result) => {
        if (result.value) 
        {
            const response = await send(`http://localhost:3333/list/${id}`, "DELETE")

            if(response.status == 200)
            {
                Swal.fire({
                    icon: 'success',
                    title: 'Item deletado',
                    showConfirmButton: false,
                    timer: 1000
                })

                selectList()
            }
        }
    })
}

async function deleteAllList()
{
    Swal.fire({
        title: 'Você tem certeza?',
        text: "Não será possível desfazer essa ação!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não',
        showClass: {
            popup: 'animated fadeInDown faster'
        },
        hideClass: {
            popup: 'animated fadeOutUp faster'
        }
    })
    .then(async (result) => {
        if (result.value) 
        {
            const response = await send(`http://localhost:3333/list`, "DELETE")

            if(response.status == 200)
            {
                Swal.fire({
                    icon: 'success',
                    title: 'Item deletado',
                    showConfirmButton: false,
                    timer: 1000
                })

                selectList()
            }
        }
    })
}



/** HELPER DOS SELECTs */

/** Popula o select com as categorias */
async function populateProductOptions()
{
    let product = await (await send(`http://localhost:3333/product`)).json()

    $("#listModalProduct").html("")

    product.map(function(obj){
        $("#listModalProduct").html(`<option value="${obj.productID}">${obj.productName}</option>`)
    })
}

/** Popula o select com os mercados */
async function populateMarketOptions()
{
    let market = await (await send(`http://localhost:3333/market`)).json()

    $("#listModalMarket").html("")

    market.map(function(obj){
        $("#listModalMarket").html(`<option value="${obj.id}">${obj.name}</option>`)
    })
}

function getListModalData()
{
    let payload = {};
    let formData = new FormData(document.getElementById('listModalForm'))
    formData.forEach((value, key) => {payload[key] = value});
    payload = JSON.stringify(payload);

    return payload
}



/** HELPERS DA DATATABLE */

/**
 * Renderiza os dados do relatório na datatable
 * @param {*} data = dados do relatório
 */
function renderReportData(data)
{
    data[0].map(function(obj){
        obj.action = 
        `
            <a href="#" class="btn btn-warning mr-3" onclick="updateList('${obj.id}', '${obj.marketID}', '${obj.productID}', '${obj.weight}', '${obj.weighing}', '${obj.amount}', '${obj.price}')"><i class="fas fa-edit"></i></a>
            <a href="#" class="btn btn-danger" onclick="deleteList(${obj.id})"><i class="fas fa-trash-alt"></i></a>
        `
        obj.price = `R$ ${parseFloat(obj.price).toFixed(2)}`
    })

    $("#tableReport").DataTable(prepareDatatable(data[0]));
}

/**
 * Retorna o objeto de configuração do Datatable
 * @param {*} data = dados a serem renderizados na datatable
 * @param {*} columns = colunas extras
 */
function prepareDatatable(data, columns = false)
{
    let datatableConfig = 
    {
        "data": data,
        "stateSave": true,
        "autoWidth" : true,
        "bPaginate" : true,
        "destroy": true,
        "dom": 'Bfrtip',
        "aLengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
        
        "language": 
        {
            "lengthMenu": "Mostra _MENU_ registros por página",
            "zeroRecords": "Nada encontrado",
            "info": "Mostrando página _PAGE_ de _PAGES_",
            "infoEmpty": "Sem registros disponí­veis",
            "infoFiltered": "(filtrados de _MAX_ total de registros)",
            "search": "<span style='background-color:#21a9e1; color: #fff;'>Pesquisa :</span>",
            "paginate": { "previous": "Anterior", "next": "Próxima" },
        },
        
        "columns": 
        [
            { data: "product", width: "10%"},
            { data: "market", width: "10%"},
            { data: "price", width: "10%"},
            { data: "difference", width: "10%"},
            { data: "amount", width: "10%"},
            { data: "weighing", width: "10%"},
            { data: "weight", width: "10%"},
            { data: "action", width: "10%"},
        ],

        buttons: 
        [
            'excelHtml5',
            'csvHtml5',
            { extend: 'copyHtml5', text: 'Copiar' },
            { extend: 'pdfHtml5', orientation: 'landscape', pageSize: 'LEGAL', title: ""},
        ],                                    
    }

    if(columns != false)
    {
        datatableConfig.columns = [...datatableConfig.columns, ...columns]

        return datatableConfig
    }

    return datatableConfig
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