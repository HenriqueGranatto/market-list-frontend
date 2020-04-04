$(document).ready(async function(){
    selectProduct()
})

async function selectProduct()
{
    const response = await send(`http://localhost:3333/product`)
    renderReportData(await response.json())
}

async function insertProduct()
{
    populateCategoryOptions()

    $("#btnProductModal").off()
    $('#productModal').modal('show')

    $("#productModalName").val("")
    $("#productModalCategory").val("")

    $("#btnProductModal").click(async function(){
        const payload = JSON.stringify({"name": $("#productModalName").val(), category: $("#productModalCategory").val()})
        const response = await send(`http://localhost:3333/product`, "POST", payload)

        if(response.status == 200)
        {
            $('#productModal').modal('hide')

            Swal.fire({
                icon: 'success',
                title: 'Produto adicionado',
                showConfirmButton: false,
                timer: 1000
            })

            selectProduct()
        }
    })
}

async function updateProduct(product, name, category)
{
    populateCategoryOptions()

    $("#btnProductModal").off()
    $('#productModal').modal('show')

    $("#productModalName").val(name)
    $("#productModalCategory").val(category)
    
    $("#btnProductModal").click(async function(){
        const payload = JSON.stringify({"name": $("#productModalName").val(), category: $("#productModalCategory").val()})
        const response = await send(`http://localhost:3333/product/${product}`, "PUT", payload)

        if(response.status == 200)
        {
            $('#productModal').modal('hide')

            Swal.fire({
                icon: 'success',
                title: 'Produto atualizado',
                showConfirmButton: false,
                timer: 1000
            })

            selectProduct()
        }
    })
}

async function deleteProduct(product)
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
            const response = await send(`http://localhost:3333/product/${product}`, "DELETE")

            if(response.status == 200)
            {
                Swal.fire({
                    icon: 'success',
                    title: 'Produto deletado',
                    showConfirmButton: false,
                    timer: 1000
                })

                selectProduct()
            }
        }
    })
}



/** HELPER DO SELECT DE CATEGORIAS */

/** Popula o select com as categorias */
async function populateCategoryOptions()
{
    let categories = await (await send(`http://localhost:3333/category`)).json()

    $("#productModalCategory").html("")

    categories.map(function(obj){
        $("#productModalCategory").html(`<option value="${obj.id}">${obj.name}</option>`)
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
            <a href="#" class="btn btn-warning mr-3" onclick="updateProduct(${obj.productID}, '${obj.productName}', '${obj.categoryID}')"><i class="fas fa-edit"></i></a>
            <a href="#" class="btn btn-danger" onclick="deleteProduct(${obj.productID})"><i class="fas fa-trash-alt"></i></a>
        `
    })

    $("#tableReport").DataTable(prepareDatatable(data));
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
            { data: "productName", width: "10%"},
            { data: "categoryName", width: "10%"},
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