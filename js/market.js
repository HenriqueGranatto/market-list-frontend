$(document).ready(async function(){
    selectMarket()
})

async function selectMarket()
{
    const response = await send(`http://localhost:3333/market`)
    renderReportData(await response.json())
}

async function insertMarket()
{
    $("#btnMarketModal").off()
    $("#marketModalName").val("")
    $('#marketModal').modal('show')

    $("#btnMarketModal").click(async function(){
        console.log($("#marketModalName").val())
        const payload = JSON.stringify({"name": $("#marketModalName").val()})
        const response = await send(`http://localhost:3333/market`, "POST", payload)

        if(response.status == 200)
        {
            $('#marketModal').modal('hide')

            Swal.fire({
                icon: 'success',
                title: 'Mecado adicionado',
                showConfirmButton: false,
                timer: 1000
            })

            selectMarket()
        }
    })
}

async function updateMarket(market, name)
{
    $("#btnMarketModal").off()
    $('#marketModal').modal('show')
    $("#marketModalName").val(name)
    
    $("#btnMarketModal").click(async function(){
        console.log($("#marketModalName").val())
        const payload = JSON.stringify({"name": $("#marketModalName").val()})
        const response = await send(`http://localhost:3333/market/${market}`, "PUT", payload)

        if(response.status == 200)
        {
            $('#marketModal').modal('hide')

            Swal.fire({
                icon: 'success',
                title: 'Mecado atualizado',
                showConfirmButton: false,
                timer: 1000
            })

            selectMarket()
        }
    })
}

async function deleteMarket(market)
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
            const response = await send(`http://localhost:3333/market/${market}`, "DELETE")

            if(response.status == 200)
            {
                Swal.fire({
                    icon: 'success',
                    title: 'Mercado deletado',
                    showConfirmButton: false,
                    timer: 1000
                })

                selectMarket()
            }
        }
    })
}



/** HELPERS DA DATATABLE */

/**
 * Renderiza os dados do relatório na datatable
 * @param {*} data = dados do relatório
 */
function renderReportData(data)
{
    data.map(function(obj){
        obj.action = 
        `
            <a href="#" class="btn btn-warning mr-3" onclick="updateMarket(${obj.id}, '${obj.name}')"><i class="fas fa-edit"></i></a>
            <a href="#" class="btn btn-danger" onclick="deleteMarket(${obj.id})"><i class="fas fa-trash-alt"></i></a>
        `
    })

    $("#table_report").DataTable(prepareDatatable(data));
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
            { data: "name", width: "10%"},
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