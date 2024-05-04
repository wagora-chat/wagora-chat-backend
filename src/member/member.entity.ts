import {
    Member,
} from "@prisma/client";

export class MemberEntity implements Member {
    constructor(readonly id: bigint,
                readonly email: string,
                readonly nickname: string,
                readonly password: string,
                readonly profile: string) {
    }
}