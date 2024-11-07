export const chatRoomFixture = (name: string, managerId: bigint, ids: bigint[]) => {

    const uniqueMemberIds = Array.from(new Set([managerId,
        ...ids,]));

    return {
        name: name,
        color: "Red",
        managerId: managerId,
        MemberRoom: {
            create: uniqueMemberIds.map(id => ({
                memberId: id,
            })),
        },
    };
};
