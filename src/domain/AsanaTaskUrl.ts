import { URL } from "node:url";
import { ASANA_BASE_URL } from "../const";
import { getLastPath } from "../url";
import { ValueObject } from "./ValueObject";

declare const Unique: unique symbol;

export class AsanaTaskUrl extends ValueObject<string> {
  // @ts-ignore
  private [Unique]: void;

  constructor(protected val: string) {
    super(val)

    const newUrl = new URL(val)

    if (newUrl.origin !== ASANA_BASE_URL) throw new InvalidArgumentError(`有効なAsanaのタスクURLではありません。val=${val}`)
    if (newUrl.pathname.split('/').length !== 2) throw new InvalidArgumentError(`有効なAsanaのタスクURLではありません。val=${val}`)
  }

  public taskGid() {
    return getLastPath(this.value)
  }
}
