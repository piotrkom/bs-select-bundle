var AxiolabBootstrapSelect = {
    timer: null,
    searchValue: null,
    currentRequest: null,
    initAjaxSearching: function(inputId, inputName, config) {
        $select    = $("body " + inputId);
        $container = $select.parent();
        $form      = $container.closest('form');
        $searchbox = $container.find('.bs-searchbox');
        $searchbar = $container.find("input[type='text']");
        $loader    = "<div class='text-center'><i class='fa fa-refresh fa-spin'></i></div>";

        $searchbox.on('input propertychange', function(e) {
            e.stopPropagation();
        });

        $searchbar.on('keyup', function() {
            var search_pattern = $(this).val();

            if (search_pattern != AxiolabBootstrapSelect.searchValue && search_pattern.length >= config.search_start) {
                $("body").find('.dropdown-menu .no-results').html($loader);
                if (AxiolabBootstrapSelect.timer != null) {
                    clearTimeout(AxiolabBootstrapSelect.timer);
                }

                if (AxiolabBootstrapSelect.currentRequest != null) {
                    AxiolabBootstrapSelect.currentRequest.abort();
                }

                AxiolabBootstrapSelect.timer = setTimeout(
                    function() {
                        AxiolabBootstrapSelect.currentRequest = $.ajax({
                            url : $form.attr('action'),
                            type: $form.attr('method'),
                            data : {
                                bsselect_search: search_pattern,
                                search_input_id: inputId.replace('#', ''),
                                search_input_name: inputName
                            },
                            success: function(html) {
                                AxiolabBootstrapSelect.currentRequest = null;
                                clearTimeout(AxiolabBootstrapSelect.timer);

                                $newSelect = $(html).find(inputId);
                                $("body " + inputId).html($newSelect.html());
                                $("body " + inputId).selectpicker('refresh');
                                $("body " + inputId).selectpicker('setSize');
                                AxiolabBootstrapSelect.searchValue = search_pattern;
                            }
                        });
                    },
                    250
                );
            }
        });
    }
};
