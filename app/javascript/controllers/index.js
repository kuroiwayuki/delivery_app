import { application } from "./application"

import FilterModalController from "./filter_modal_controller"
application.register("filter-modal", FilterModalController)

import HelloController from "./hello_controller"
application.register("hello", HelloController)

import StoreSuggestionsController from "./store_suggestions_controller"
application.register("store-suggestions", StoreSuggestionsController)

import ChartsController from "./charts_controller"
application.register("charts", ChartsController)

import TableRowController from "./table_row_controller"
application.register("table-row", TableRowController)