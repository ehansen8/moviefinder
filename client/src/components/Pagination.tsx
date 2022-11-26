import React from 'react'

export default function Pagination() {
  return <div>Pagination</div>
}

/**<nav class="sticky-bottom w-100 d-flex flex-row justify-content-center">
    <ul class="pagination pagination">

        <!-- 1st & previous page-->
        {% if recommended_page.number > 2 %}
        <li class="page-item"><a class="page-link"
               href="#"
               data-page="1">1</a></li>
        </li>
        {%endif%}

        <!-- Previous page-->
        {% if recommended_page.has_previous %}
        <li class="page-item"><a class="page-link"
               href="#"
               data-page="{{recommended_page.previous_page_number}}">{{recommended_page.previous_page_number}}</a>
        </li>
        {%endif%}

        <!-- Current Page -->
        <li class="page-item active"><a class="page-link"
               href="#"
               data-page="{{recommended_page.number}}">{{recommended_page.number}}</a>
        </li>

        <!-- Next Page-->
        {% if recommended_page.has_next %}
        <li class="page-item"><a class="page-link"
               href="#"
               data-page="{{recommended_page.next_page_number}}">{{recommended_page.next_page_number}}</a>
        </li>
        {%endif%}

        <!-- Last Page-->
        {% if recommended_page.number < recommended_page.paginator.num_pages|add:"-1" %}
        </li>
        <li class="page-item"><a class="page-link"
               href="#"
               data-page="{{recommended_page.paginator.num_pages}}">{{recommended_page.paginator.num_pages}}</a>
        </li>
        {%endif%}

    </ul>
</nav> */
