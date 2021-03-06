import React from 'react'
import TableHeader from './TableHeader'
import TableRow from './TableRow'
import FilterContext from '../Context/FilterStore'
import PaginateContext from '../Context/PaginateStore'
import DataContext from '../Context/DataStore'
import StyledTable from '../Styled/StyledTable'

function Table () {
  const { data, loading, error } = React.useContext(DataContext)
  const { offset, PER_PAGE, setPageCount } = React.useContext(PaginateContext)
  const { filter } = React.useContext(FilterContext)

  const column = filter.filters.order.column
  const sort = filter.filters.order.sort

  function findNameMatch (wordToMatch, planet) {
    const regex = new RegExp(wordToMatch, 'gi')
    return planet.name.search(regex)
  }

  function hasFilter (filter) {
    return !!(filter.column && filter.comparison && filter.value)
  }

  function findMatches (filter, planet) {
    let result = [true]

    filter.filters.filterByNumericValues.forEach(filterItem => {
      if (hasFilter(filterItem)) {
        switch (filterItem.comparison) {
          case '===':
            result.push(
              Number(planet[filterItem.column]) === Number(filterItem.value)
            )
            break
          case '>':
            result.push(
              Number(planet[filterItem.column]) > Number(filterItem.value)
            )
            break
          case '<':
            result.push(
              Number(planet[filterItem.column]) < Number(filterItem.value)
            )
            break

          default:
            result.push(false)
        }
      }
    })
    return result.reduce((acc, curr) => {
      return acc && curr
    })
  }

  function filterTableRows () {
    return data.filter(planet => {
      if (findNameMatch(filter.filters.filterByName.name, planet) === -1)
        return null
      if (filter.filters.hasFilter)
        if (!findMatches(filter, planet)) return null

      return planet
    })
  }

  function sortTableRows () {
    return filterTableRows().sort((a, b) => {
      const prevPlanet = /^\d{1,}$/g.test(a)
        ? Number(a)[column]
        : a[column].toLowerCase()
      const nextPlanet = /^\d{1,}$/g.test(b)
        ? Number(b)[column]
        : b[column].toLowerCase()

      if (sort === 'ASC') {
        if (prevPlanet < nextPlanet) return -1
        if (prevPlanet > nextPlanet) return 1
      }
      if (sort === 'DESC') {
        if (prevPlanet > nextPlanet) return -1
        if (prevPlanet < nextPlanet) return 1
      }

      return 0
    })
  }

  function paginateTableRows () {
    setPageCount(Math.ceil(data.length / PER_PAGE))
    return sortTableRows().slice(offset, offset + PER_PAGE)
  }

  function renderTableRows () {
    return paginateTableRows().map(planet => (
      <TableRow planet={planet} key={planet.name} />
    ))
  }

  if (loading) return <div>Carregando...</div>
  return (
    <StyledTable>
      <TableHeader />
      <tbody>{renderTableRows()}</tbody>
    </StyledTable>
  )
}

export default Table
