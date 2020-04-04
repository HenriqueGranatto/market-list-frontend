$(document).ready(async function(){
    selectCategory()
})

async function selectCategory()
{
    const response = await send(`http://35.222.24.235:3000/category`)
    renderReportData(await response.json())
}

async function insertCategory()
{
    $("#btnCategoryModal").off()
    $('#categoryModal').modal('show')

    $("#categoryModalName").val("")

    $("#btnCategoryModal").click(async function(){
        const payload = JSON.stringify({"name": $("#categoryModalName").val()})
        const response = await send(`http://35.222.24.235:3000/category`, "POST", payload)

        if(response.status == 200)
        {
            $('#categoryModal').modal('hide')

            Swal.fire({
                icon: 'success',
                title: 'Categoria adicionado',
                showConfirmButton: false,
                timer: 1000
            })

            selectCategory()
        }
    })
}

async function updateCategory(category, name)
{
    $("#btnCategoryModal").off()
    $('#categoryModal').modal('show')

    $("#categoryModalName").val(name)
    
    $("#btnCategoryModal").click(async function(){
        const payload = JSON.stringify({"name": $("#categoryModalName").val()})
        const response = await send(`http://35.222.24.235:3000/category/${category}`, "PUT", payload)

        if(response.status == 200)
        {
            $('#categoryModal').modal('hide')

            Swal.fire({
                icon: 'success',
                title: 'Categoria atualizado',
                showConfirmButton: false,
                timer: 1000
            })

            selectCategory()
        }
    })
}

async function deleteCategory(category)
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
            const response = await send(`http://35.222.24.235:3000/category/${category}`, "DELETE")

            if(response.status == 200)
            {
                Swal.fire({
                    icon: 'success',
                    title: 'Categoria deletado',
                    showConfirmButton: false,
                    timer: 1000
                })

                selectCategory()
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
            <a href="#" class="btn btn-warning mr-3" onclick="updateCategory(${obj.id}, '${obj.name}')"><i class="fas fa-edit"></i></a>
            <a href="#" class="btn btn-danger" onclick="deleteCategory(${obj.id})"><i class="fas fa-trash-alt"></i></a>
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