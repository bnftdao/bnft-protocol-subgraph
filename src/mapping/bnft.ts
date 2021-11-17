import { Initialized, Mint, Burn, FlashLoan } from "../../generated/templates/BNFT/BNFT";
import { FlashLoan as FlashLoanAction } from "../../generated/schema";
import { getOrInitBNFT } from "../helpers/initializers";
import { zeroAddress, zeroBI } from "../utils/converters";
import { Address, BigInt, ethereum, log } from "@graphprotocol/graph-ts";
import { EventTypeRef, getHistoryId } from "../utils/id-generation";

export function handleInitialized(event: Initialized): void {}

export function handleMint(event: Mint): void {
  let bnft = getOrInitBNFT(event.address);

  bnft.lifetimeMints = bnft.lifetimeFlashLoans.plus(new BigInt(1));
  bnft.save();
}

export function handleBurn(event: Burn): void {
  let bnft = getOrInitBNFT(event.address);

  bnft.lifetimeBurns = bnft.lifetimeFlashLoans.plus(new BigInt(1));
  bnft.save();
}

export function handleFlashLoan(event: FlashLoan): void {
  let bnft = getOrInitBNFT(event.address);

  bnft.lifetimeFlashLoans = bnft.lifetimeFlashLoans.plus(new BigInt(1));
  bnft.save();

  let flashLoan = new FlashLoanAction(getHistoryId(event, EventTypeRef.FlashLoan));
  flashLoan.bnft = bnft.id;
  flashLoan.nftAsset = event.params.nftAsset;
  flashLoan.nftTokenId = event.params.tokenId;
  flashLoan.target = event.params.target;
  flashLoan.initiator = event.params.initiator;
  flashLoan.timestamp = event.block.timestamp.toI32();
  flashLoan.save();
}
