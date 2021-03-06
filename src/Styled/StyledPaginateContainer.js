import styled from 'styled-components'

export default styled.div`
  .pagination {
    margin: 15px auto;
    display: flex;
    justify-content: center;
    color: #a3a3a3;
    font-weight: bold;
    list-style: none;
    outline: none;

    & > li {
      & > a {
        padding: 5px 10px;
        border-radius: 5px;
        cursor: pointer;
        box-shadow: 2px 2px 2px #575757;
        &:hover,
        &:focus {
          background: #e6e6e6;
          color: #252525;
        }
      }
    }
  }

  .break-me {
    cursor: default;
    color: blue;
  }

  .active {
    color: black;
  }
`
