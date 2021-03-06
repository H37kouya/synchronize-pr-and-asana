import { URL } from "url";
import { ASANA_BASE_URL } from "../const";
import { getLastPath } from "../url";
import { ValueObject } from "./ValueObject";
import { InvalidArgumentError } from './InvalidArgumentError'

declare const Unique: unique symbol;

export class AsanaTaskUrl extends ValueObject<string> {
  // @ts-ignore
  private [Unique]: void;

  constructor(protected val: string) {
    super(val)

    const newUrl = new URL(val)

    if (`${newUrl.origin}/0` !== ASANA_BASE_URL)
      throw new InvalidArgumentError(
        `有効なAsanaのタスクURLではありません。ASANA_BASE_URLが異なります。 origin=${newUrl.origin}/0, val=${val}`
      )
    if (newUrl.pathname.split('/').length !== 4) throw new InvalidArgumentError(`有効なAsanaのタスクURLではありません。パスの数が異なります。val=${val}`)
  }

  public taskGid() {
    return getLastPath(this.value)
  }
}
