/** @jsx jsx */
import styled from '@emotion/styled';

const PlayAgainButton = styled.div`
  cursor: pointer;
  z-index: 2;
  position: fixed;
  bottom: 16px;
  width: calc(100% - 20px);
  height: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
  font: 400 14px/1 VarelaRound;
  text-transform: uppercase;
  background-color: #ec0eae;
  border-radius: 8px;
  color: #fff;
`;

PlayAgainButton.displayName = 'PlayAgainButton';

export default PlayAgainButton;
